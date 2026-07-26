import { FormEvent, useState } from 'react';
import { ApiError } from '../../api/client';
import { phoneNumber, required, type FieldErrors } from '../../utils/formValidation';
import { prependStorageRecord } from '../../utils/localStorage';

export type SubmitField = 'name' | 'phone';

export type SubmitMessage = {
  type: 'backend' | 'local' | 'error';
  text: string;
};

export const submitMessageStyles: Record<SubmitMessage['type'], string> = {
  backend: 'rounded-2xl border border-leaf/25 bg-leaf/15 px-4 py-3 text-sm font-semibold text-carbon',
  local: 'rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800',
  error: 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700',
};

type UseRecordSubmitOptions<TForm extends { name: string; phone: string }, TRecord> = {
  initialForm: TForm;
  nameRequiredMessage: string;
  buildRecord: (form: TForm) => TRecord;
  submitToBackend: (record: TRecord) => Promise<unknown>;
  storageKey: string;
  backendSuccessText: string;
  localFallbackText: string;
};

// 预约演示与询价意向表单共用的提交流程：
// 校验 -> 优先提交后端 -> 后端明确拒绝时展示原因并保留表单 -> 仅后端不可达时降级写入 localStorage。
export function useRecordSubmit<TForm extends { name: string; phone: string }, TRecord>({
  initialForm,
  nameRequiredMessage,
  buildRecord,
  submitToBackend,
  storageKey,
  backendSuccessText,
  localFallbackText,
}: UseRecordSubmitOptions<TForm, TRecord>) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors<SubmitField>>({});
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof TForm, value: string) {
    setForm((current) => ({ ...current, [field]: value } as TForm));
    setSubmitMessage(null);

    if (field === 'name' || field === 'phone') {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validate() {
    const nextErrors: FieldErrors<SubmitField> = {};

    const nameError = required(form.name, nameRequiredMessage);
    if (nameError) {
      nextErrors.name = nameError;
    }

    const phoneError = phoneNumber(form.phone);
    if (phoneError) {
      nextErrors.phone = phoneError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function resetForm() {
    setForm(initialForm);
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !validate()) {
      return;
    }

    const record = buildRecord(form);

    setIsSubmitting(true);
    try {
      await submitToBackend(record);
      setSubmitMessage({ type: 'backend', text: backendSuccessText });
      resetForm();
    } catch (error) {
      if (error instanceof ApiError && error.status > 0) {
        // 后端明确拒绝（如校验失败）：展示原因并保留表单内容，不写本地副本
        setSubmitMessage({ type: 'error', text: `提交失败：${error.message}` });
      } else {
        // 后端不可达：降级保存到 localStorage
        try {
          prependStorageRecord(storageKey, record);
          setSubmitMessage({ type: 'local', text: localFallbackText });
          resetForm();
        } catch {
          setSubmitMessage({
            type: 'error',
            text: '后端不可用，且本地存储写入失败，请稍后重试。',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, errors, submitMessage, isSubmitting, updateField, handleSubmit };
}
