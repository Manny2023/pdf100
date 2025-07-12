const qInput = document.getElementById("quality");
const qVal = document.getElementById("qVal");
qInput.addEventListener("input", () => {
  qVal.innerText = Math.round(qInput.value * 100) + "%";
});

document.getElementById("convertBtn").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const input = document.getElementById("fileInput");
  const files = input.files;
  const quality = parseFloat(qInput.value);

  if (!files.length) {
    alert("Selecciona al menos una imagen.");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imgData = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    const img = new Image();
    img.src = imgData;

    await new Promise(resolve => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const compressed = canvas.toDataURL("image/jpeg", quality);

        const w = pdf.internal.pageSize.getWidth();
        const h = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(w / img.width, h / img.height);
        const nw = img.width * ratio;
        const nh = img.height * ratio;
        const x = (w - nw) / 2;
        const y = (h - nh) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(compressed, "JPEG", x, y, nw, nh);
        resolve();
      };
    });
  }

  pdf.save("mannymansistem.pdf");
});
