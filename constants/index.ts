export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Giấy khai sinh",
  "Giấy phép lái xe",
  "Thẻ/Chính sách bảo hiểm y tế",
  "Thẻ căn cước quân nhân",
  "Thẻ căn cước quốc gia",
  "Hộ chiếu",
  "Thẻ thường trú nhân (Thẻ xanh)",
  "Thẻ an sinh xã hội",
  "Thẻ căn cước tiểu bang",
  "Thẻ căn cước sinh viên",
  "Thẻ căn cước cử tri",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Bác sĩ Nguyễn Văn An",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Bác sĩ Lê Thị Mai",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Bác sĩ Trần Minh Đức",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Bác sĩ Phạm Hoàng Evan",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Bác sĩ Vũ Thuỳ Trang",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Bác sĩ Bùi Quang Khải",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Bác sĩ Hoàng Yến My",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Bác sĩ Đặng Phương Anh",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Bác sĩ Ngô Gia Hưng",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
