import { createInquiry } from '../../api/inquiries';
import type { InquiryRecord } from '../../types/inquiry';
import { createRecordId } from '../../utils/id';
import { STORAGE_KEYS } from '../../utils/localStorage';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { submitMessageStyles, useRecordSubmit } from './useRecordSubmit';

const initialForm = {
  name: '',
  phone: '',
  organization: '',
  expectedScenario: '',
  budgetRange: '',
  message: '',
};

export function InquiryForm() {
  const { form, errors, submitMessage, isSubmitting, updateField, handleSubmit } = useRecordSubmit({
    initialForm,
    nameRequiredMessage: '请填写询价联系人',
    buildRecord: (current): InquiryRecord => ({
      id: createRecordId('inq'),
      name: current.name.trim(),
      phone: current.phone.trim(),
      organization: current.organization.trim() || undefined,
      expectedScenario: current.expectedScenario.trim() || undefined,
      budgetRange: current.budgetRange.trim() || undefined,
      message: current.message.trim() || undefined,
      createdAt: new Date().toISOString(),
    }),
    submitToBackend: (record) =>
      createInquiry({
        name: record.name,
        phone: record.phone,
        organization: record.organization,
        expectedScenario: record.expectedScenario,
        budgetRange: record.budgetRange,
        message: record.message,
      }),
    storageKey: STORAGE_KEYS.inquiries,
    backendSuccessText: '询价意向已提交到后端数据库，可登录 /admin 查看。',
    localFallbackText: '后端服务暂不可用，询价记录已保存到本地演示数据（仅当前浏览器可见）。',
  });

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
