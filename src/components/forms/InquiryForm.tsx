import { FormEvent, useState } from 'react';
import { ApiError } from '../../api/client';
import { createInquiry } from '../../api/inquiries';
import type { InquiryRecord } from '../../types/inquiry';
import { phoneNumber, required, type FieldErrors } from '../../utils/formValidation';
import { createRecordId } from '../../utils/id';
import { prependStorageRecord, STORAGE_KEYS } from '../../utils/localStorage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type InquiryFields = 'name' | 'phone';

type SubmitMessage = {
  type: 'backend' | 'local' | 'error';
  text: string;
};

const submitMessageStyles: Record<SubmitMessage['type'], string> = {
  backend: 'rounded-2xl border border-leaf/25 bg-leaf/15 px-4 py-3 text-sm font-semibold text-carbon',
  local: 'rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800',
  error: 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700',
};

const initialForm = {
  name: '',
  phone: '',
  organization: '',
  expectedScenario: '',
  budgetRange: '',
  message: '',
};

export function InquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors<InquiryFields>>({});
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitMessage(null);

    if (field === 'name' || field === 'phone') {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validate() {
    const nextErrors: FieldErrors<InquiryFields> = {
      name: required(form.name, '请填写询价联系人'),
      phone: phoneNumber(form.phone),
    };

    Object.keys(nextErrors).forEach((key) => {
      const typedKey = key as InquiryFields;
      if (!nextErrors[typedKey]) {
        delete nextErrors[typedKey];
      }
    });

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

    const record: InquiryRecord = {
      id: createRecordId('inq'),
      name: form.name.trim(),
      phone: form.phone.trim(),
      organization: form.organization.trim() || undefined,
      expectedScenario: form.expectedScenario.trim() || undefined,
      budgetRange: form.budgetRange.trim() || undefined,
      message: form.message.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      await createInquiry({
        name: record.name,
        phone: record.phone,
        organization: record.organization,
        expectedScenario: record.expectedScenario,
        budgetRange: record.budgetRange,
        message: record.message,
      });
      setSubmitMessage({
        type: 'backend',
        text: '询价意向已提交到后端数据库，可登录 /admin 查看。',
      });
      resetForm();
    } catch (error) {
      if (error instanceof ApiError && error.status > 0) {
        // 后端明确拒绝（如校验失败）：展示原因并保留表单内容，不写本地副本
        setSubmitMessage({ type: 'error', text: `提交失败：${error.message}` });
      } else {
        // 后端不可达：降级保存到 localStorage
        try {
          prependStorageRecord(STORAGE_KEYS.inquiries, record);
          setSubmitMessage({
            type: 'local',
            text: '后端服务暂不可用，询价记录已保存到本地演示数据（仅当前浏览器可见）。',
          });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="联系人"
          name="inquiry-name"
          value={form.name}
          maxLength={100}
          placeholder="例如：李老师"
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <Input
          label="联系电话"
          name="inquiry-phone"
          value={form.phone}
          maxLength={20}
          placeholder="手机号或座机"
          error={errors.phone}
          onChange={(event) => updateField('phone', event.target.value)}
        />
      </div>
      <Input
        label="单位/合作方"
        name="inquiry-organization"
        value={form.organization}
        maxLength={200}
        placeholder="例如：某合作社或净菜加工单位"
        onChange={(event) => updateField('organization', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="应用场景"
          name="inquiry-scenario"
          value={form.expectedScenario}
          maxLength={200}
          placeholder="如：高校展示、合作社、小型净菜处理"
          onChange={(event) => updateField('expectedScenario', event.target.value)}
        />
        <Input
          label="预算范围"
          name="inquiry-budget"
          value={form.budgetRange}
          maxLength={100}
          placeholder="例如：待沟通"
          onChange={(event) => updateField('budgetRange', event.target.value)}
        />
      </div>
      <Textarea
        label="询价说明"
        name="inquiry-message"
        value={form.message}
        maxLength={2000}
        placeholder="请描述关注点，例如设备模块、样机改型或展示合作需求"
        onChange={(event) => updateField('message', event.target.value)}
      />
      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? '提交中…' : '提交询价意向'}
      </Button>
      {submitMessage ? (
        <p className={submitMessageStyles[submitMessage.type]} role="status" aria-live="polite">
          {submitMessage.text}
        </p>
      ) : null}
    </form>
  );
}
