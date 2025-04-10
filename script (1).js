let keranjang = [
  { nama: "Indomie Goreng", harga: 3000, qty: 2 },
  { nama: "Teh Botol", harga: 5000, qty: 1 },
];
let riwayat = [];

function renderKeranjang() {
  console.log("Keranjang diperbarui:", keranjang);
}

function tampilkanPopup(id) {
  document.getElementById(id).classList.remove("hidden");
}

function tutupPopup() {
  document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
}

function generateStrukContent(data, waktu) {
  document.getElementById("struk-waktu").innerText = waktu;
  const strukList = document.getElementById("struk-list");
  const totalSpan = document.getElementById("struk-total");

  strukList.innerHTML = "";
  let total = 0;

  data.forEach(item => {
    const row = document.createElement("div");
    row.innerHTML = `<span>${item.nama} x${item.qty}</span><span>Rp${(item.harga * item.qty).toLocaleString()}</span>`;
    strukList.appendChild(row);
    total += item.harga * item.qty;
  });

  totalSpan.innerText = `Rp${total.toLocaleString()}`;
}

window.downloadStrukTXT = () => {
  const waktu = document.getElementById("struk-waktu").innerText;
  let text = `Struk Belanja – Warung Barokah\nAlamat: Jl. Cempaka Raya\n${waktu}\n\n`;

  document.querySelectorAll("#struk-list div").forEach(div => {
    text += div.innerText + '\n';
  });

  text += `\nTotal: ${document.getElementById("struk-total").innerText}`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "struk-belanja.txt";
  a.click();
};

window.downloadStrukPDF = () => {
  const waktu = document.getElementById("struk-waktu").innerText;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  doc.setFont("courier", "normal");
  doc.setFontSize(12);
  doc.text("Struk Belanja – Warung Barokah", 10, y);
  y += 8;
  doc.text("Jl. Cempaka Raya", 10, y);
  y += 8;
  doc.text(waktu, 10, y);
  y += 10;

  document.querySelectorAll("#struk-list div").forEach(div => {
    doc.text(div.innerText, 10, y);
    y += 8;
  });

  y += 4;
  doc.text(`Total: ${document.getElementById("struk-total").innerText}`, 10, y);
  doc.save("struk-belanja.pdf");
};

window.printStruk = () => {
  const content = document.getElementById("struk-preview").innerHTML;
  const win = window.open("", "", "width=600,height=800");
  win.document.write(`<html><head><title>Print Struk</title><style>body{font-family:Lora,serif;padding:20px;}h2{text-align:center;}</style></head><body>${content}</body></html>`);
  win.document.close();
  win.print();
};

document.querySelector(".checkout").addEventListener("click", () => {
  if (keranjang.length === 0) return alert("Keranjang kosong!");
  const waktu = new Date().toLocaleString();

  generateStrukContent(keranjang, waktu);
  tampilkanPopup("popup-struk");

  riwayat.push({
    waktu,
    total: keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0),
    detail: [...keranjang]
  });

  keranjang = [];
  renderKeranjang();
});

document.querySelector(".lihat-riwayat").addEventListener("click", () => {
  const konten = document.getElementById("riwayat-list");
  konten.innerHTML = "";
  riwayat.forEach((r, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${r.waktu} - Rp${r.total.toLocaleString()}
      <button onclick="lihatStrukRiwayat(${i})">Lihat</button>
    `;
    konten.appendChild(div);
  });
  tampilkanPopup("popup-riwayat");
});

window.lihatStrukRiwayat = (i) => {
  const r = riwayat[i];
  generateStrukContent(r.detail, r.waktu);
  tampilkanPopup("popup-struk");
};