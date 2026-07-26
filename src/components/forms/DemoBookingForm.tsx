import { FormEvent, useState } from 'react';
import { createBooking } from '../../api/bookings';
import { ApiError } from '../../api/client';
import type { DemoBookingRecord } from '../../types/booking';
import { phoneNumber, required, type FieldErrors } from '../../utils/formValidation';
import { createRecordId } from '../../utils/id';
import { prependStorageRecord, STORAGE_KEYS } from '../../utils/localStorage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type DemoBookingFields = 'name' | 'phone';

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
  preferredDate: '',
  message: '',
};

export function DemoBookingForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors<DemoBookingFields>>({});
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
    const nextErrors: FieldErrors<DemoBookingFields> = {
      name: required(form.name, '请填写联系人姓名'),
      phone: phoneNumber(form.phone),
    };

    Object.keys(nextErrors).forEach((key) => {
      const typedKey = key as DemoBookingFields;
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

    const record: DemoBookingRecord = {
      id: createRecordId('demo'),
      name: form.name.trim(),
      phone: form.phone.trim(),
      organization: form.organization.trim() || undefined,
      preferredDate: form.preferredDate || undefined,
      message: form.message.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      await createBooking({
        name: record.name,
        phone: record.phone,
        organization: record.organization,
        preferredDate: record.preferredDate,
        message: record.message,
      });
      setSubmitMessage({
        type: 'backend',
        text: '已提交到后端数据库，可登录 /admin 查看。',
      });
      resetForm();
    } catch (error) {
      if (error instanceof ApiError && error.status > 0) {
        // 后端明确拒绝（如校验失败）：展示原因并保留表单内容，不写本地副本
        setSubmitMessage({ type: 'error', text: `提交失败：${error.message}` });
      } else {
        // 后端不可达：降级保存到 localStorage
        try {
          prependStorageRecord(STORAGE_KEYS.demoBookings, record);
          setSubmitMessage({
            type: 'local',
            text: '后端服务暂不可用，已保存到本地演示数据（仅当前浏览器可见）。',
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
          name="demo-name"
          value={form.name}
          maxLength={100}
          placeholder="例如：张同学"
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <Input
          label="联系电话"
          name="demo-phone"
          value={form.phone}
          maxLength={20}
          placeholder="手机号或座机"
          error={errors.phone}
          onChange={(event) => updateField('phone', event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="单位/学院"
          name="demo-organization"
          value={form.organization}
          maxLength={200}
          placeholder="例如：某学院或参赛单位"
          onChange={(event) => updateField('organization', event.target.value)}
        />
        <Input
          label="期望演示日期"
          name="demo-date"
          type="date"
          value={form.preferredDate}
          onChange={(event) => updateField('preferredDate', event.target.value)}
        />
      </div>
      <Textarea
        label="演示需求"
        name="demo-message"
        value={form.message}
        maxLength={2000}
        placeholder="例如：希望了解设备结构、样机运行流程或比赛展示内容"
        onChange={(event) => updateField('message', event.target.value)}
      />
      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? '提交中…' : '提交预约演示'}
      </Button>
      {submitMessage ? (
        <p className={submitMessageStyles[submitMessage.type]} role="status" aria-live="polite">
          {submitMessage.text}
        </p>
      ) : null}
    </form>
  );
}
