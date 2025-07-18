import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Search, Upload } from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function MembershipTypeRequest(): JSX.Element {
    const [tab, setTab] = useState<"BUSINESS" | "CONSULTANT">("BUSINESS");
    const [business, setBusiness] = useState({
        company: "",
        companyEmail: "",
        businessField: "",
        reason: "",
        businessRegFile: null as File | null,
    });
    const [consultant, setConsultant] = useState({
        activity: "",
        link: "",
        certFile: null as File | null,
        experience: "",
        reason: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // (임시) 유저 이름/이메일
    const userName = "홍길동";
    const userEmail = "hong@jobdam.com";

    // 공통 네비 아이템
    const navItems = [
        { label: "커뮤니티", href: "#" },
        { label: "SNS 피드", href: "#" },
        { label: "포인트", href: "#" },
        { label: "마이페이지", href: "/mypage" },
        { label: "로그아웃", href: "#" },
    ];

    // 신청 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let reqBody: any = {};
            if (tab === "BUSINESS") {
                // 필수값 체크
                if (!business.company.trim()) {
                    alert("회사명을 입력해주세요.");
                    setLoading(false); return;
                }
                if (!business.businessRegFile) {
                    alert("사업자등록증 파일을 첨부해주세요.");
                    setLoading(false); return;
                }
                reqBody = {
                    type: "BUSINESS",
                    company: business.company,
                    companyEmail: business.companyEmail,
                    businessField: business.businessField,
                    reason: business.reason,
                };
            } else {
                // 필수값 체크
                if (!consultant.activity.trim()) {
                    alert("활동분야를 입력해주세요.");
                    setLoading(false); return;
                }
                if (!consultant.experience.trim()) {
                    alert("경력 설명을 입력해주세요.");
                    setLoading(false); return;
                }
                reqBody = {
                    type: "CONSULTANT",
                    activity: consultant.activity,
                    link: consultant.link,
                    reason: consultant.reason,
                    experience: consultant.experience,
                };
            }

            // FormData로 파일 포함 (multipart/form-data)
            const formData = new FormData();
            Object.entries(reqBody).forEach(([k, v]) => formData.append(k, v));
            if (tab === "BUSINESS" && business.businessRegFile) {
                formData.append("businessRegFile", business.businessRegFile);
            }
            if (tab === "CONSULTANT" && consultant.certFile) {
                formData.append("certFile", consultant.certFile);
            }

            // 실제 요청
            await api.post("/membertype-change", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("전환 신청이 정상적으로 접수되었습니다.");
            navigate("/mypage");
        } catch (e: any) {
            alert("신청 실패: " + (e?.response?.data?.message || "오류"));
        }
        setLoading(false);
    };

    return (
        <div className="bg-white flex flex-row justify-center w-full">
            <div className="bg-white w-full max-w-[1440px] relative min-h-screen">
                {/* Header/Navigation */}
                <header className="w-full h-20 flex items-center justify-center gap-5 p-5 bg-white shadow-[0px_0px_6px_#0000001f] sticky top-0 z-10">
                    <img
                        className="relative w-[85px] h-20 cursor-pointer"
                        alt="JobDam logo"
                        src="/logo.png"
                        onClick={() => navigate("/homepage")}
                    />
                    <div
                        className="relative flex-1 font-sans font-normal text-black text-[28px] tracking-[0] leading-9 cursor-pointer"
                        onClick={() => navigate("/homepage")}
                    >
                        JobDam
                    </div>
                    <nav className="inline-flex items-center justify-center gap-10 relative bg-white">
                        {navItems.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.href}
                                className="font-sans font-normal text-black text-base tracking-[0] leading-6 whitespace-nowrap hover:text-gray-600 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="flex w-[200px] items-center justify-end gap-1 p-2 rounded-md border border-solid border-[#0000001a]">
                            <Input
                                className="flex-1 border-none shadow-none h-5 p-0 text-sm text-[#00000080] placeholder:text-[#00000080] focus-visible:ring-0 bg-transparent"
                                placeholder="Search in site"
                            />
                            <Search className="w-5 h-5 text-gray-500" />
                        </div>
                    </nav>
                </header>

                {/* Page Title */}
                <div className="flex flex-col items-center mt-[80px] mb-10 px-4">
                    <h1 className="font-sans font-bold text-black text-[40px] text-center leading-10 tracking-[0] whitespace-nowrap">
                        회원타입 전환 신청
                    </h1>
                    <p className="mt-3 font-sans font-normal text-[#000000b2] text-base text-center leading-6 tracking-[0] max-w-[650px]">
                        회원타입 전환 신청을 통해 역할 변경을 요청할 수 있습니다. 전환 신청은 관리자 승인 후 완료됩니다.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="w-[800px] mx-auto mb-16 rounded-xl border border-solid border-[#00000014] shadow-[0px_0px_12px_#00000014] overflow-hidden">
                    <CardContent className="p-0">
                        <Tabs value={tab} className="w-full" onValueChange={val => setTab(val as any)}>
                            <TabsList className="w-full h-[60px] rounded-none grid grid-cols-2 p-0">
                                <TabsTrigger
                                    value="BUSINESS"
                                    className={`h-full rounded-none ${tab === "BUSINESS"
                                        ? "bg-white border-b-2 border-black text-black font-bold"
                                        : "bg-[#f8f9fa] border-b-2 border-[#00000014] text-[#00000099]"
                                    } font-sans font-medium`}
                                >
                                    기업 회원 전환
                                </TabsTrigger>
                                <TabsTrigger
                                    value="CONSULTANT"
                                    className={`h-full rounded-none ${tab === "CONSULTANT"
                                        ? "bg-white border-b-2 border-black text-black font-bold"
                                        : "bg-[#f8f9fa] border-b-2 border-[#00000014] text-[#00000099]"
                                    } font-sans font-medium`}
                                >
                                    컨설턴트 전환
                                </TabsTrigger>
                            </TabsList>

                            {/* 기업 회원 전환 탭 */}
                            <TabsContent value="BUSINESS" className="p-8">
                                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* 이름, 이메일 */}
                                    <div className="flex gap-5">
                                        <div className="flex-1 space-y-2">
                                            <label className="font-sans font-medium text-black text-sm leading-5">이름</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userName} disabled />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="font-sans font-medium text-black text-sm leading-5">이메일</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userEmail} disabled />
                                        </div>
                                    </div>
                                    {/* 회사명 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm">회사명 <span className="text-[#e53e3e]">*</span></label>
                                        <Input
                                            className="h-[42px] border-[#00000026] pl-3"
                                            placeholder="회사명을 입력해주세요"
                                            value={business.company}
                                            onChange={e => setBusiness({ ...business, company: e.target.value })}
                                        />
                                    </div>
                                    {/* 회사 이메일 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm">
                                            회사 이메일 <span className="text-xs font-normal text-[#00000080]">(선택사항, @company.com 권장)</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026] pl-3"
                                            placeholder="company@example.com"
                                            value={business.companyEmail}
                                            onChange={e => setBusiness({ ...business, companyEmail: e.target.value })}
                                        />
                                    </div>
                                    {/* 사업자등록증 업로드 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm">사업자등록증 업로드 <span className="text-[#e53e3e]">*</span></label>
                                        <div className="relative h-[54px] border border-solid border-[#00000026] rounded-md flex items-center px-3">
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                onChange={e => setBusiness({ ...business, businessRegFile: e.target.files?.[0] || null })}
                                                className="w-full"
                                            />
                                            <Upload className="w-3.5 h-4 ml-2" />
                                        </div>
                                        <p className="font-sans font-normal text-[#00000080] text-xs">PDF, JPG, PNG 파일만 업로드 가능합니다.</p>
                                    </div>
                                    {/* 사업 분야 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm">사업 분야</label>
                                        <Textarea
                                            className="h-[102px] border-[#00000026] resize-none"
                                            placeholder="회사 주요 사업 분야를 입력해주세요"
                                            value={business.businessField}
                                            onChange={e => setBusiness({ ...business, businessField: e.target.value })}
                                        />
                                    </div>
                                    {/* 전환 사유 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm">전환 사유</label>
                                        <Textarea
                                            className="h-[102px] border-[#00000026] resize-none"
                                            placeholder="회원타입 전환을 원하는 이유를 입력해주세요"
                                            value={business.reason}
                                            onChange={e => setBusiness({ ...business, reason: e.target.value })}
                                        />
                                    </div>
                                    {/* 버튼 */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 mt-4 bg-black text-white rounded-md hover:bg-gray-800"
                                        disabled={loading}
                                    >
                                        {loading ? "신청중..." : "신청하기"}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* 컨설턴트 전환 탭 */}
                            <TabsContent value="CONSULTANT" className="p-8">
                                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="flex gap-5">
                                        <div className="flex-1 space-y-2">
                                            <label className="font-sans font-medium text-black text-sm leading-5">이름</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userName} disabled />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="font-sans font-medium text-black text-sm leading-5">이메일</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userEmail} disabled />
                                        </div>
                                    </div>
                                    {/* 활동분야 */}
                                    <div className="space-y-2">
                                        <label className="flex items-center font-sans font-medium text-black text-sm leading-5">
                                            활동분야 <span className="text-[#e53e3e] ml-1">*</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026]"
                                            placeholder="예: IT 컨설팅, 마케팅 전략, 인사 관리 등"
                                            value={consultant.activity}
                                            onChange={e => setConsultant({ ...consultant, activity: e.target.value })}
                                        />
                                    </div>
                                    {/* 포트폴리오/SNS */}
                                    <div className="space-y-2">
                                        <label className="flex items-center font-sans">
                                            <span className="font-medium text-black text-sm leading-5">포트폴리오 또는 SNS 링크</span>
                                            <span className="ml-2 font-normal text-[#00000080] text-xs leading-5">(선택사항, 본인 전문성 증명 링크)</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026]"
                                            placeholder="https://portfolio.example.com"
                                            value={consultant.link}
                                            onChange={e => setConsultant({ ...consultant, link: e.target.value })}
                                        />
                                    </div>
                                    {/* 자격증/수료증 업로드 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm leading-5">자격증/수료증 업로드</label>
                                        <div className="relative h-[54px] border border-solid border-[#00000026] rounded-md flex items-center px-3">
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                onChange={e => setConsultant({ ...consultant, certFile: e.target.files?.[0] || null })}
                                                className="w-full"
                                            />
                                            <Upload className="w-3.5 h-4 ml-2" />
                                        </div>
                                        <p className="font-sans font-normal text-[#00000080] text-xs">PDF, JPG, PNG 파일만 업로드 가능합니다.</p>
                                    </div>
                                    {/* 경력 설명 */}
                                    <div className="space-y-2">
                                        <label className="flex items-center font-sans font-medium text-black text-sm leading-5">
                                            경력 설명 <span className="text-[#e53e3e] ml-1">*</span>
                                        </label>
                                        <Textarea
                                            className="min-h-[102px] border-[#00000026]"
                                            placeholder="주요 프로젝트, 업무경험 등 상세하게 입력"
                                            value={consultant.experience}
                                            onChange={e => setConsultant({ ...consultant, experience: e.target.value })}
                                        />
                                    </div>
                                    {/* 전환 사유 */}
                                    <div className="space-y-2">
                                        <label className="font-sans font-medium text-black text-sm leading-5">전환 사유</label>
                                        <Textarea
                                            className="min-h-[102px] border-[#00000026]"
                                            placeholder="회원타입 전환을 원하는 이유를 입력해주세요"
                                            value={consultant.reason}
                                            onChange={e => setConsultant({ ...consultant, reason: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 mt-4 bg-black text-white rounded-md hover:bg-gray-800"
                                        disabled={loading}
                                    >
                                        {loading ? "신청중..." : "신청하기"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
