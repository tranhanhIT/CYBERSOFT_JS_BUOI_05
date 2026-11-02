/* ---------------------------------------------------------
   HÀM DÙNG CHUNG
   --------------------------------------------------------- */

// Định dạng số thành tiền Việt, ví dụ: 1500000 -> "1.500.000"
function dinhDangTien(soTien) {
  return soTien.toLocaleString("vi-VN");
}

// Hiển thị thông báo lỗi (khung đỏ) vào ô kết quả
function hienThiLoi(idKetQua, noiDung) {
  var oKetQua = document.getElementById(idKetQua);
  oKetQua.className = "o-ket-qua co-loi";
  oKetQua.innerHTML = "❌ " + noiDung;
}

// Hiển thị kết quả (khung xanh) vào ô kết quả
function hienThiKetQua(idKetQua, noiDung) {
  var oKetQua = document.getElementById(idKetQua);
  oKetQua.className = "o-ket-qua thanh-cong";
  oKetQua.innerHTML = "✅ " + noiDung;
}


/* ---------------------------------------------------------
   CHUYỂN BÀI TẬP (menu bên trái)
   Bấm "Bài n" thì hiện section bai-n, ẩn các bài còn lại
   --------------------------------------------------------- */

var SO_BAI_TAP = 4;

function chonBai(soBai) {
  for (var i = 1; i <= SO_BAI_TAP; i++) {
    var section = document.getElementById("bai-" + i);
    var tab = document.getElementById("tab-" + i);

    if (i === soBai) {
      section.classList.remove("hidden");
      tab.classList.add("tab-active");
    } else {
      section.classList.add("hidden");
      tab.classList.remove("tab-active");
    }
  }
}

document.getElementById("tab-1").onclick = function () { chonBai(1); };
document.getElementById("tab-2").onclick = function () { chonBai(2); };
document.getElementById("tab-3").onclick = function () { chonBai(3); };
document.getElementById("tab-4").onclick = function () { chonBai(4); };

// Mặc định mở Bài 1
chonBai(1);


/* =========================================================
   BÀI 1: QUẢN LÝ TUYỂN SINH
   Đầu vào : điểm chuẩn, điểm 3 môn, khu vực, đối tượng
   Xử lý   : tổng điểm = 3 môn + ưu tiên khu vực + ưu tiên đối tượng
             đậu nếu tổng >= điểm chuẩn và không có môn nào = 0
   Đầu ra  : đậu / rớt và tổng điểm
   ========================================================= */

// Trả về điểm ưu tiên theo khu vực
function layDiemKhuVuc(khuVuc) {
  if (khuVuc === "A") {
    return 2;
  } else if (khuVuc === "B") {
    return 1;
  } else if (khuVuc === "C") {
    return 0.5;
  }
  return 0; // Khu vực X: không ưu tiên
}

// Trả về điểm ưu tiên theo đối tượng
function layDiemDoiTuong(doiTuong) {
  if (doiTuong === "1") {
    return 2.5;
  } else if (doiTuong === "2") {
    return 1.5;
  } else if (doiTuong === "3") {
    return 1;
  }
  return 0; // Đối tượng 0: không ưu tiên
}

function xuLyTuyenSinh() {
  // Khối 1: Đầu vào
  var diemChuanNhap = document.getElementById("diemChuan").value;
  var diem1Nhap = document.getElementById("diemMon1").value;
  var diem2Nhap = document.getElementById("diemMon2").value;
  var diem3Nhap = document.getElementById("diemMon3").value;
  var khuVuc = document.getElementById("khuVuc").value;
  var doiTuong = document.getElementById("doiTuong").value;

  // Kiểm tra dữ liệu
  if (diemChuanNhap === "" || diem1Nhap === "" || diem2Nhap === "" || diem3Nhap === "") {
    hienThiLoi("ketQuaTuyenSinh", "Vui lòng nhập đầy đủ điểm chuẩn và điểm 3 môn.");
    return;
  }

  var diemChuan = Number(diemChuanNhap);
  var diem1 = Number(diem1Nhap);
  var diem2 = Number(diem2Nhap);
  var diem3 = Number(diem3Nhap);

  if (diem1 < 0 || diem1 > 10 || diem2 < 0 || diem2 > 10 || diem3 < 0 || diem3 > 10) {
    hienThiLoi("ketQuaTuyenSinh", "Điểm mỗi môn phải nằm trong khoảng 0 đến 10.");
    return;
  }

  // Khối 2: Xử lý
  var diemUuTien = layDiemKhuVuc(khuVuc) + layDiemDoiTuong(doiTuong);
  var tongDiem = diem1 + diem2 + diem3 + diemUuTien;

  // Khối 3: Đầu ra
  if (diem1 === 0 || diem2 === 0 || diem3 === 0) {
    hienThiLoi("ketQuaTuyenSinh",
      "<b>Bạn đã rớt</b> do có môn bị điểm 0. Tổng điểm: <b>" + tongDiem + "</b>");
  } else if (tongDiem >= diemChuan) {
    hienThiKetQua("ketQuaTuyenSinh",
      "<b>Bạn đã đậu.</b> Tổng điểm: <b>" + tongDiem + "</b> (điểm ưu tiên: " + diemUuTien + ")");
  } else {
    hienThiLoi("ketQuaTuyenSinh",
      "<b>Bạn đã rớt.</b> Tổng điểm: <b>" + tongDiem + "</b>, thấp hơn điểm chuẩn " + diemChuan);
  }
}

document.getElementById("btnTuyenSinh").onclick = xuLyTuyenSinh;


/* =========================================================
   BÀI 2: TÍNH TIỀN ĐIỆN
   Đầu vào : họ tên, số Kw
   Xử lý   : tính lũy tiến theo từng bậc
             50 Kw đầu: 500đ | 50 Kw kế: 650đ | 100 Kw kế: 850đ
             150 Kw kế: 1100đ | còn lại: 1300đ
   Đầu ra  : tiền điện phải trả
   ========================================================= */

// Giá điện từng bậc (đặt hằng số để dễ sửa sau này)
var GIA_BAC_1 = 500;   // 50 Kw đầu      (0   -> 50)
var GIA_BAC_2 = 650;   // 50 Kw kế       (51  -> 100)
var GIA_BAC_3 = 850;   // 100 Kw kế      (101 -> 200)
var GIA_BAC_4 = 1100;  // 150 Kw kế      (201 -> 350)
var GIA_BAC_5 = 1300;  // Còn lại        (trên 350)

function tinhTienDien(soKw) {
  var tienDien = 0;

  if (soKw <= 50) {
    tienDien = soKw * GIA_BAC_1;
  } else if (soKw <= 100) {
    tienDien = 50 * GIA_BAC_1 + (soKw - 50) * GIA_BAC_2;
  } else if (soKw <= 200) {
    tienDien = 50 * GIA_BAC_1 + 50 * GIA_BAC_2 + (soKw - 100) * GIA_BAC_3;
  } else if (soKw <= 350) {
    tienDien = 50 * GIA_BAC_1 + 50 * GIA_BAC_2 + 100 * GIA_BAC_3 + (soKw - 200) * GIA_BAC_4;
  } else {
    tienDien = 50 * GIA_BAC_1 + 50 * GIA_BAC_2 + 100 * GIA_BAC_3 + 150 * GIA_BAC_4 + (soKw - 350) * GIA_BAC_5;
  }

  return tienDien;
}

function xuLyTienDien() {
  // Khối 1: Đầu vào
  var hoTen = document.getElementById("tenKhachDien").value.trim();
  var soKwNhap = document.getElementById("soKw").value;

  if (hoTen === "" || soKwNhap === "") {
    hienThiLoi("ketQuaTienDien", "Vui lòng nhập họ tên và số Kw.");
    return;
  }

  var soKw = Number(soKwNhap);
  if (soKw < 0) {
    hienThiLoi("ketQuaTienDien", "Số Kw không được âm.");
    return;
  }

  // Khối 2: Xử lý
  var tienDien = tinhTienDien(soKw);

  // Khối 3: Đầu ra
  hienThiKetQua("ketQuaTienDien",
    "Họ tên: <b>" + hoTen + "</b><br>" +
    "Số Kw: <b>" + soKw + "</b><br>" +
    "Tiền điện: <b>" + dinhDangTien(tienDien) + " VNĐ</b>");
}

document.getElementById("btnTinhTienDien").onclick = xuLyTienDien;


/* =========================================================
   BÀI 3: TÍNH THUẾ THU NHẬP CÁ NHÂN
   Đầu vào : họ tên, tổng thu nhập năm, số người phụ thuộc
   Xử lý   : thu nhập chịu thuế = tổng thu nhập - 4tr - số người phụ thuộc * 1.6tr
             tra bảng thuế suất theo thu nhập chịu thuế
             thuế = thu nhập chịu thuế * thuế suất
   Đầu ra  : thuế thu nhập cá nhân phải trả
   ========================================================= */

var MOT_TRIEU = 1000000;

// Trả về thuế suất (dạng số thập phân) theo thu nhập chịu thuế
function layThueSuat(thuNhapChiuThue) {
  if (thuNhapChiuThue <= 60 * MOT_TRIEU) {
    return 0.05;
  } else if (thuNhapChiuThue <= 120 * MOT_TRIEU) {
    return 0.1;
  } else if (thuNhapChiuThue <= 210 * MOT_TRIEU) {
    return 0.15;
  } else if (thuNhapChiuThue <= 384 * MOT_TRIEU) {
    return 0.2;
  } else if (thuNhapChiuThue <= 624 * MOT_TRIEU) {
    return 0.25;
  } else if (thuNhapChiuThue <= 960 * MOT_TRIEU) {
    return 0.3;
  }
  return 0.35;
}

function xuLyThue() {
  // Khối 1: Đầu vào
  var hoTen = document.getElementById("tenNguoiNopThue").value.trim();
  var tongThuNhapNhap = document.getElementById("tongThuNhap").value;
  var soNguoiPhuThuocNhap = document.getElementById("soNguoiPhuThuoc").value;

  if (hoTen === "" || tongThuNhapNhap === "") {
    hienThiLoi("ketQuaThue", "Vui lòng nhập họ tên và tổng thu nhập năm.");
    return;
  }

  var tongThuNhap = Number(tongThuNhapNhap);
  var soNguoiPhuThuoc = Number(soNguoiPhuThuocNhap); // Để trống -> 0

  if (tongThuNhap < 0 || soNguoiPhuThuoc < 0) {
    hienThiLoi("ketQuaThue", "Thu nhập và số người phụ thuộc không được âm.");
    return;
  }

  // Khối 2: Xử lý
  var thuNhapChiuThue = tongThuNhap - 4 * MOT_TRIEU - soNguoiPhuThuoc * 1.6 * MOT_TRIEU;

  if (thuNhapChiuThue <= 0) {
    hienThiKetQua("ketQuaThue",
      "Họ tên: <b>" + hoTen + "</b><br>Thu nhập chịu thuế không lớn hơn 0, bạn <b>không phải nộp thuế</b>.");
    return;
  }

  var thueSuat = layThueSuat(thuNhapChiuThue);
  var tienThue = thuNhapChiuThue * thueSuat;

  // Khối 3: Đầu ra
  hienThiKetQua("ketQuaThue",
    "Họ tên: <b>" + hoTen + "</b><br>" +
    "Thu nhập chịu thuế: <b>" + dinhDangTien(thuNhapChiuThue) + " VNĐ</b><br>" +
    "Thuế suất: <b>" + (thueSuat * 100) + "%</b><br>" +
    "Thuế thu nhập cá nhân: <b>" + dinhDangTien(tienThue) + " VNĐ</b>");
}

document.getElementById("btnTinhThue").onclick = xuLyThue;


/* =========================================================
   BÀI 4: TÍNH TIỀN CÁP
   Đầu vào : mã khách hàng, loại khách hàng, số kết nối, số kênh cao cấp
   Xử lý   : Nhà dân     = 4.5 + 20.5 + 7.5 * số kênh
             Doanh nghiệp = 15 + 75 (10 kết nối đầu) + 5 * (số kết nối vượt 10) + 50 * số kênh
   Đầu ra  : tổng tiền cáp ($)
   ========================================================= */

// Hiện / ẩn ô "Số kết nối" theo loại khách hàng
function doiLoaiKhachHang() {
  var loaiKhachHang = document.getElementById("loaiKhachHang").value;
  var khungSoKetNoi = document.getElementById("khungSoKetNoi");

  if (loaiKhachHang === "doanhNghiep") {
    khungSoKetNoi.classList.remove("hidden");
  } else {
    khungSoKetNoi.classList.add("hidden");
    document.getElementById("soKetNoi").value = "";
  }
}

document.getElementById("loaiKhachHang").onchange = doiLoaiKhachHang;

function tinhTienCapNhaDan(soKenh) {
  var phiXuLy = 4.5;
  var phiCoBan = 20.5;
  var phiKenh = 7.5 * soKenh;
  return phiXuLy + phiCoBan + phiKenh;
}

function tinhTienCapDoanhNghiep(soKetNoi, soKenh) {
  var phiXuLy = 15;
  var phiCoBan = 75; // Đã bao gồm 10 kết nối đầu
  if (soKetNoi > 10) {
    phiCoBan = phiCoBan + (soKetNoi - 10) * 5;
  }
  var phiKenh = 50 * soKenh;
  return phiXuLy + phiCoBan + phiKenh;
}

function xuLyTienCap() {
  // Khối 1: Đầu vào
  var maKhachHang = document.getElementById("maKhachHang").value.trim();
  var loaiKhachHang = document.getElementById("loaiKhachHang").value;
  var soKetNoi = Number(document.getElementById("soKetNoi").value);
  var soKenh = Number(document.getElementById("soKenhCaoCap").value);

  if (maKhachHang === "") {
    hienThiLoi("ketQuaTienCap", "Vui lòng nhập mã khách hàng.");
    return;
  }
  if (soKetNoi < 0 || soKenh < 0) {
    hienThiLoi("ketQuaTienCap", "Số kết nối và số kênh không được âm.");
    return;
  }

  // Khối 2: Xử lý
  var tienCap = 0;
  if (loaiKhachHang === "nhaDan") {
    tienCap = tinhTienCapNhaDan(soKenh);
  } else {
    tienCap = tinhTienCapDoanhNghiep(soKetNoi, soKenh);
  }

  // Khối 3: Đầu ra
  hienThiKetQua("ketQuaTienCap",
    "Mã khách hàng: <b>" + maKhachHang + "</b><br>" +
    "Tiền cáp: <b>$" + tienCap.toFixed(2) + "</b>");
}

document.getElementById("btnTinhTienCap").onclick = xuLyTienCap;
