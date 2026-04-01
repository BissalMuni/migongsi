import FileUpload from "@/components/FileUpload";

export default function AdminUploadPage() {
  return (
    <div>
      <h1 className="text-lg font-bold text-gray-800 mb-4">
        데이터 업로드
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        xlsx 파일을 업로드하여 주택가격 데이터를 등록합니다.
      </p>
      <FileUpload />
    </div>
  );
}
