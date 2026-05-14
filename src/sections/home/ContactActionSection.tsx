import { DemoBookingForm } from '../../components/forms/DemoBookingForm';
import { InquiryForm } from '../../components/forms/InquiryForm';
import { SectionShell } from '../../components/layout/SectionShell';
import { Card } from '../../components/ui/Card';

export function ContactActionSection() {
  return (
    <SectionShell
      id="contact"
      eyebrow="Contact"
      title="预约演示与询价意向"
      description="表单不会发送到服务器，提交内容仅保存在当前浏览器 localStorage 中，用于比赛现场演示。"
      className="bg-mist"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card elevated className="bg-white">
          <div className="mb-6">
            <p className="text-sm font-semibold text-aqua">Demo Booking</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-carbon">预约项目演示</h3>
            <p className="mt-3 text-sm leading-7 text-steel">
              适合答辩评委、指导老师或潜在合作方记录演示沟通需求。
            </p>
          </div>
          <DemoBookingForm />
        </Card>
        <Card elevated className="bg-white">
          <div className="mb-6">
            <p className="text-sm font-semibold text-aqua">Inquiry</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-carbon">提交询价意向</h3>
            <p className="mt-3 text-sm leading-7 text-steel">
              仅作为比赛展示模拟流程，不构成真实报价或商业承诺。
            </p>
          </div>
          <InquiryForm />
        </Card>
      </div>
    </SectionShell>
  );
}
