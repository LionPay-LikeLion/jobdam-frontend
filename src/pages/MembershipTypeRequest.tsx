import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";

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

    // 임시 사용자 정보
    const userName = "홍길동";
    const userEmail = "hong@jobdam.com";

    // 신청 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let reqBody: any = {};
            let attachment: File | null = null;
            
            if (tab === "BUSINESS") {
                if (!business.company.trim()) {
                    alert("회사명을 입력해주세요."); setLoading(false); return;
                }
                if (!business.businessRegFile) {
                    alert("사업자등록증 파일을 첨부해주세요."); setLoading(false); return;
                }
                reqBody = {
                    requestedMemberTypeCode: "EMPLOYEE",
                    title: business.company, // 회사명을 제목으로 사용
                    reason: business.reason || "",
                    content: `회사명: ${business.company}\n회사이메일: ${business.companyEmail || "미입력"}\n사업분야: ${business.businessField || "미입력"}`,
                    referenceLink: business.companyEmail || "", // 기업의 경우 회사 이메일을 reference_url에 저장
                };
                attachment = business.businessRegFile;
            } else {
                if (!consultant.activity.trim()) {
                    alert("활동분야를 입력해주세요."); setLoading(false); return;
                }
                if (!consultant.experience.trim()) {
                    alert("경력 설명을 입력해주세요."); setLoading(false); return;
                }
                reqBody = {
                    requestedMemberTypeCode: "HUNTER",
                    title: consultant.activity, // 활동분야를 제목으로 사용
                    reason: consultant.reason || "",
                    content: `활동분야: ${consultant.activity}\n경력설명: ${consultant.experience}`,
                    referenceLink: consultant.link || "", // 컨설턴트의 경우 포트폴리오/SNS 링크를 reference_url에 저장
                };
                attachment = consultant.certFile;
            }

            // FormData로 파일 포함 (multipart/form-data)
            const formData = new FormData();
            
            // 타입 안전하게 FormData에 추가
            Object.entries(reqBody).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });
            
            // 파일 첨부
            if (attachment) {
                formData.append("attachment", attachment);
            }

            // 디버깅: FormData 내용 확인
            console.log("전송할 데이터:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            await api.post("/membertype-change", formData, {
                // Content-Type 헤더 제거 - 브라우저가 자동으로 boundary 설정
            });

            alert("전환 신청이 정상적으로 접수되었습니다.");
            navigate("/mypage");
        } catch (e: any) {
            alert("신청 실패: " + (e?.response?.data?.message || "오류"));
        }
        setLoading(false);
    };

    return (
        <div className="bg-white min-h-screen w-full">
            {/* Top Navigation Bar */}
            <TopBar />
            {/* Title and Description */}
            <div className="flex flex-col items-center mt-[70px] mb-10">
                <h1 className="font-bold text-black text-[40px] text-center mb-3">회원타입 전환 신청</h1>
                <p className="text-[#444] text-base text-center">
                    회원타입 전환 신청을 통해 역할 변경을 요청할 수 있습니다.<br />
                    전환 신청은 관리자 승인 후 완료됩니다.
                </p>
            </div>

            {/* Main Card - Centered */}
            <div className="flex justify-center w-full">
                <Card className="w-[650px] rounded-xl border border-solid border-[#00000014] shadow-[0px_0px_12px_#00000014]">
                    <CardContent className="p-0">
                        <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
                            <TabsList className="w-full h-[56px] grid grid-cols-2 rounded-t-xl overflow-hidden p-0">
                                <TabsTrigger
                                    value="BUSINESS"
                                    className={`h-full text-lg ${tab === "BUSINESS" ? "bg-white border-b-2 border-black font-bold" : "bg-[#f8f9fa] border-b-2 border-[#00000014]"}`}
                                >
                                    기업 회원 전환
                                </TabsTrigger>
                                <TabsTrigger
                                    value="CONSULTANT"
                                    className={`h-full text-lg ${tab === "CONSULTANT" ? "bg-white border-b-2 border-black font-bold" : "bg-[#f8f9fa] border-b-2 border-[#00000014]"}`}
                                >
                                    컨설턴트 전환
                                </TabsTrigger>
                            </TabsList>

                            {/* 기업 회원 전환 탭 */}
                            <TabsContent value="BUSINESS" className="p-8">
                                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="flex gap-5">
                                        <div className="flex-1 space-y-2">
                                            <label className="font-medium text-black text-sm">이름</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userName} disabled />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="font-medium text-black text-sm">이메일</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userEmail} disabled />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">
                                            회사명 <span className="text-[#e53e3e]">*</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026]"
                                            placeholder="회사명을 입력해주세요"
                                            value={business.company}
                                            onChange={e => setBusiness({ ...business, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">
                                            회사 이메일 <span className="text-xs font-normal text-[#00000080]">(선택사항, @company.com 권장)</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026]"
                                            placeholder="company@example.com"
                                            value={business.companyEmail}
                                            onChange={e => setBusiness({ ...business, companyEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">
                                            사업자등록증 업로드 <span className="text-[#e53e3e]">*</span>
                                        </label>
                                        <div className="relative h-[54px] border border-solid border-[#00000026] rounded-md flex items-center px-3">
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                onChange={e => setBusiness({ ...business, businessRegFile: e.target.files?.[0] || null })}
                                                className="w-full"
                                            />
                                            <Upload className="w-4 h-4 ml-2" />
                                        </div>
                                        <p className="text-xs text-[#888]">PDF, JPG, PNG 파일만 업로드 가능합니다.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">사업 분야</label>
                                        <Textarea
                                            className="h-[80px] border-[#00000026] resize-none"
                                            placeholder="회사 주요 사업 분야를 입력해주세요"
                                            value={business.businessField}
                                            onChange={e => setBusiness({ ...business, businessField: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">전환 사유</label>
                                        <Textarea
                                            className="h-[80px] border-[#00000026] resize-none"
                                            placeholder="회원타입 전환을 원하는 이유를 입력해주세요"
                                            value={business.reason}
                                            onChange={e => setBusiness({ ...business, reason: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 mt-3 bg-black text-white rounded-md hover:bg-gray-800" disabled={loading}>
                                        {loading ? "신청중..." : "신청하기"}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* 컨설턴트 전환 탭 */}
                            <TabsContent value="CONSULTANT" className="p-8">
                                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="flex gap-5">
                                        <div className="flex-1 space-y-2">
                                            <label className="font-medium text-black text-sm">이름</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userName} disabled />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="font-medium text-black text-sm">이메일</label>
                                            <Input className="h-[42px] bg-[#f8f9fa] border-[#00000026]" value={userEmail} disabled />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">
                                            활동분야 <span className="text-[#e53e3e]">*</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026]"
                                            placeholder="예: IT 컨설팅, 마케팅 전략, 인사 관리 등"
                                            value={consultant.activity}
                                            onChange={e => setConsultant({ ...consultant, activity: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">포트폴리오 또는 SNS 링크
                                            <span className="ml-2 font-normal text-[#00000080] text-xs">(선택사항, 본인 전문성 증명 링크)</span>
                                        </label>
                                        <Input
                                            className="h-[42px] border-[#00000026]"
                                            placeholder="https://portfolio.example.com"
                                            value={consultant.link}
                                            onChange={e => setConsultant({ ...consultant, link: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">자격증/수료증 업로드</label>
                                        <div className="relative h-[54px] border border-solid border-[#00000026] rounded-md flex items-center px-3">
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                onChange={e => setConsultant({ ...consultant, certFile: e.target.files?.[0] || null })}
                                                className="w-full"
                                            />
                                            <Upload className="w-4 h-4 ml-2" />
                                        </div>
                                        <p className="text-xs text-[#888]">PDF, JPG, PNG 파일만 업로드 가능합니다.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">
                                            경력 설명 <span className="text-[#e53e3e]">*</span>
                                        </label>
                                        <Textarea
                                            className="h-[80px] border-[#00000026] resize-none"
                                            placeholder="주요 프로젝트, 업무경험 등 상세하게 입력"
                                            value={consultant.experience}
                                            onChange={e => setConsultant({ ...consultant, experience: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-black text-sm">전환 사유</label>
                                        <Textarea
                                            className="h-[80px] border-[#00000026] resize-none"
                                            placeholder="회원타입 전환을 원하는 이유를 입력해주세요"
                                            value={consultant.reason}
                                            onChange={e => setConsultant({ ...consultant, reason: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 mt-3 bg-black text-white rounded-md hover:bg-gray-800" disabled={loading}>
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
