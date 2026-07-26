import { createBooking } from '../../api/bookings';
import type { DemoBookingRecord } from '../../types/booking';
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
  preferredDate: '',
  message: '',
};

export function DemoBookingForm() {
  const { form, errors, submitMessage, isSubmitting, updateField, handleSubmit } = useRecordSubmit({
    initialForm,
    nameRequiredMessage: '请填写联系人姓名',
    buildRecord: (current): DemoBookingRecord => ({
      id: createRecordId('demo'),
      name: current.name.trim(),
      phone: current.phone.trim(),
      organization: current.organization.trim() || undefined,
      preferredDate: current.preferredDate || undefined,
      message: current.message.trim() || undefined,
      createdAt: new Date().toISOString(),
    }),
    submitToBackend: (record) =>
      createBooking({
        name: record.name,
        phone: record.phone,
        organization: record.organization,
        preferredDate: record.preferredDate,
        message: record.message,
      }),
    storageKey: STORAGE_KEYS.demoBookings,
    backendSuccessText: '已提交到后端数据库，可登录 /admin 查看。',
    localFallbackText: '后端服务暂不可用，已保存到本地演示数据（仅当前浏览器可见）。',
  });

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
