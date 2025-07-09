const { jsPDF } = window.jspdf;
let customFontBase64 = '';
let generatedPdf = null; // store jsPDF object for download later

async function loadFont() {
  const res = await fetch('assets/font/font.ttf');
  const buffer = await res.arrayBuffer();
  customFontBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function splitText(text, maxWidth, pdf) {
  const words = text.split(' ');
  let lines = [], line = '';
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (pdf.getTextWidth(testLine) <= maxWidth) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function generateQRCodeBase64(text, callback) {
  QRCode.toDataURL(text, function (err, base64) {
    if (err) {
      console.error("QR Code generation failed:", err);
      callback(err, null);
    } else {
      callback(null, base64);
    }
  });
}

async function generateAndPreviewPDF(name, training, heldOn, heldAt, serialNumber, picName, picTitle, qrCode64, sign=true) {
  await loadFont();

  const img = new Image();
  img.src = 'assets/img/certificate/template.png';

  img.onload = () => {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const centerX = 297 / 2;

    pdf.addFileToVFS('customFont.ttf', customFontBase64);
    pdf.addFont('customFont.ttf', 'CustomFont', 'normal');
    pdf.setFont('CustomFont');
    pdf.addImage(img, 'PNG', 0, 0, 297, 210);

    const qrCode = new Image()
    qrCode.src = qrCode64
    pdf.addImage(qrCode, 'PNG', 264, 6, 26, 26)

    if(sign){
      const signImg = new Image();
      signImg.src = 'assets/img/certificate/sign.png';
      pdf.addImage(signImg, 'PNG', 230, 150, 40, 25)
    }

    // Participant Info
    pdf.setFontSize(30).setTextColor(0, 0, 0);
    pdf.text(name, centerX - pdf.getTextWidth(name) / 2, 98);

    // Subtitle
    pdf.setFontSize(15.9).setTextColor(25, 31, 32);
    const subTitle = "HAS ATTENDED AND COMPLETED THE TRAINING OF";
    pdf.text(subTitle, centerX - pdf.getTextWidth(subTitle) / 2, 116);

    // Training title
    const lines = splitText(training, 200, pdf);
    pdf.setFontSize(20);
    lines.forEach((line, i) => {
      pdf.text(line, centerX - pdf.getTextWidth(line) / 2, 128 + i * 10);
    });

    // Dates and CEO info
    pdf.setFontSize(14);
    pdf.text(heldOn, 18, 180);
    pdf.text(heldAt, 18, 187);
    pdf.text(picName, 239, 180);
    pdf.text(picTitle, 215, 190);

    // Serial and ID
    pdf.setFontSize(12);
    pdf.text(serialNumber, centerX - pdf.getTextWidth(serialNumber) / 2, 204);

    // Serial subtitle
    pdf.setFontSize(12);
    const serialLabel = "Certificate serial number:";
    pdf.text(serialLabel, centerX - pdf.getTextWidth(serialLabel) / 2 + 2, 196);

    generatedPdf = pdf;

    // Preview
    const embed = document.createElement('embed');
    embed.src = pdf.output('bloburl') + "#toolbar=0&navpanes=0&scrollbar=0";
    document.getElementById('pdf-preview').innerHTML = '';
    document.getElementById('pdf-preview').appendChild(embed);

    document.getElementById('download-btn').style.display = 'inline-block';
    document.getElementById('loading').style.display = 'none';
  };

  document.getElementById('download-btn').addEventListener('click', (event) => {
    event.preventDefault(); // prevent form submission or refresh
    const heldOnDate = heldOn.replace('HELD ON ','')
    if (generatedPdf) generatedPdf.save(`TMI - ${name} - ${heldOnDate}.pdf`);
  });

}