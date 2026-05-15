import { FormEvent, useState } from 'react';
import { createInquiry } from '../../api/inquiries';
import type { InquiryRecord } from '../../types/inquiry';
import { phoneNumber, required, type FieldErrors } from '../../utils/formValidation';
import { createRecordId } from '../../utils/id';
import { prependStorageRecord, STORAGE_KEYS } from '../../utils/localStorage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type InquiryFields = 'name' | 'phone';

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
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
    } catch {
      prependStorageRecord(STORAGE_KEYS.inquiries, record);
      setSubmitMessage({
        type: 'local',
        text: '后端服务暂不可用，询价记录已保存到本地演示数据。',
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
          name="inquiry-name"
          value={form.name}
          placeholder="例如：李老师"
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <Input
          label="联系电话"
          name="inquiry-phone"
          value={form.phone}
          placeholder="手机号或座机"
          error={errors.phone}
          onChange={(event) => updateField('phone', event.target.value)}
        />
      </div>
      <Input
        label="单位/合作方"
        name="inquiry-organization"
        value={form.organization}
        placeholder="TODO：单位名称"
        onChange={(event) => updateField('organization', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="应用场景"
          name="inquiry-scenario"
          value={form.expectedScenario}
          placeholder="如：高校展示、合作社、小型净菜处理"
          onChange={(event) => updateField('expectedScenario', event.target.value)}
        />
        <Input
          label="预算范围"
          name="inquiry-budget"
          value={form.budgetRange}
          placeholder="待沟通 / TODO"
          onChange={(event) => updateField('budgetRange', event.target.value)}
        />
      </div>
      <Textarea
        label="询价说明"
        name="inquiry-message"
        value={form.message}
        placeholder="请描述关注点，例如设备模块、样机改型或展示合作需求"
        onChange={(event) => updateField('message', event.target.value)}
      />
      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? '提交中…' : '提交询价意向'}
      </Button>
      {submitMessage ? (
        <p className="rounded-2xl border border-aqua/15 bg-aqua/10 px-4 py-3 text-sm font-semibold text-carbon">
          {submitMessage.text}
        </p>
      ) : null}
    </form>
  );
}
