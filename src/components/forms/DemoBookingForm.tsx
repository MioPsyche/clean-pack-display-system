import { FormEvent, useState } from 'react';
import { createBooking } from '../../api/bookings';
import type { DemoBookingRecord } from '../../types/booking';
import { phoneNumber, required, type FieldErrors } from '../../utils/formValidation';
import { createRecordId } from '../../utils/id';
import { prependStorageRecord, STORAGE_KEYS } from '../../utils/localStorage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type DemoBookingFields = 'name' | 'phone';

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
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'backend' | 'local';
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitMessage(null);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
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
    } catch {
      prependStorageRecord(STORAGE_KEYS.demoBookings, record);
      setSubmitMessage({
        type: 'local',
        text: '后端服务暂不可用，已保存到本地演示数据。',
      });
    }

    setForm(initialForm);
    setErrors({});
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="联系人"
          name="demo-name"
          value={form.name}
          placeholder="例如：张同学"
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <Input
          label="联系电话"
          name="demo-phone"
          value={form.phone}
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
          placeholder="TODO：学院或单位名称"
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
        placeholder="例如：希望了解设备结构、样机运行流程或比赛展示内容"
        onChange={(event) => updateField('message', event.target.value)}
      />
      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? '提交中…' : '提交预约演示'}
      </Button>
      {submitMessage ? (
        <p className="rounded-2xl border border-leaf/20 bg-leaf/15 px-4 py-3 text-sm font-semibold text-carbon">
          {submitMessage.text}
        </p>
      ) : null}
    </form>
  );
}
