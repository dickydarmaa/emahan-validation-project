function validasiNIK() {
  const nik = document.getElementById("nik").value.trim();
  const hasil = document.getElementById("hasil");

  if (nik.length !== 16 || isNaN(nik)) {
    hasil.innerHTML = "❌ Format NIK tidak valid. Harus 16 digit angka.";
    hasil.style.color = "red";
    return;
  }

  const kodeKab = nik.substring(0, 4);
  const kodeKec = nik.substring(0, 6);

  if (wilayahValid[kodeKab]) {
    const kabupaten = wilayahValid[kodeKab].name;
    const kecamatan = wilayahValid[kodeKab].kecamatan[kodeKec];

    if (kecamatan) {
      hasil.innerHTML = `✅ NIK valid untuk wilayah kabupaten: <b>${kabupaten}</b> pada kecamatan: <b>${kecamatan}</b>`;
      hasil.style.color = "green";
    } else {
      hasil.innerHTML =
        "❌ NIK tidak valid pada kecamatan di kabupaten tersebut.";
      hasil.style.color = "red";
    }
  } else {
    hasil.innerHTML = "❌ NIK bukan dari wilayah yang sesuai.";
    hasil.style.color = "red";
  }
}

// Fungsi proses file Excel
function prosesExcel() {
  const fileInput = document.getElementById("fileInput");
  const hasilExcel = document.getElementById("hasilExcel");

  if (!fileInput.files.length) {
    hasilExcel.innerHTML = " Silakan pilih file Excel terlebih dahulu.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let output = "<h4>Hasil Validasi:</h4><ol>";

    json.forEach((row, index) => {
      const nik = (row[3] || "").toString().trim();

      if (index === 0 && nik.toLowerCase().includes("nik")) return;

      if (nik.length !== 16 || isNaN(nik)) {
        output += `<li>${nik} ❌ Format NIK tidak valid.</li>`;
        return;
      }

      const kodeKab = nik.substring(0, 4);
      const kodeKec = nik.substring(0, 6);

      if (wilayahValid[kodeKab]) {
        const kab = wilayahValid[kodeKab].name;
        const kec = wilayahValid[kodeKab].kecamatan[kodeKec];

        if (kec) {
          output += `<li>${nik} ✅ Kabupaten: ${kab}, Kecamatan: ${kec}</li>`;
        } else {
          output += `<li>${nik} ❌ Kecamatan tidak ditemukan dalam kabupaten ${kab}</li>`;
        }
      } else {
        output += `<li>${nik} ❌ Kode wilayah tidak sesuai.</li>`;
      }
    });

    output += "</ol>";
    hasilExcel.innerHTML = output;
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
}
