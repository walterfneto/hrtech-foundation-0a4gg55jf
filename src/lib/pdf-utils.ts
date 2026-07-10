interface PdfSection {
  heading: string
  items?: Array<{ label: string; value: string }>
  content?: string
  list?: Array<{ text: string; done?: boolean }>
}

interface PdfOptions {
  title: string
  subtitle?: string
  companyName?: string
  sections: PdfSection[]
}

export function exportToPdf(opts: PdfOptions) {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return

  const sectionsHtml = opts.sections
    .map((s) => {
      let html = `<div class="section"><h2>${s.heading}</h2>`
      if (s.items) {
        html += s.items
          .map((i) => `<div class="item"><span class="label">${i.label}:</span> ${i.value}</div>`)
          .join('')
      }
      if (s.content) html += `<p class="content">${s.content}</p>`
      if (s.list) {
        html +=
          '<ul class="list">' +
          s.list.map((i) => `<li class="${i.done ? 'done' : ''}">${i.text}</li>`).join('') +
          '</ul>'
      }
      html += '</div>'
      return html
    })
    .join('')

  win.document
    .write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${opts.title}</title>
<style>@page{size:A4;margin:2cm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;line-height:1.6}.header{text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #2563eb}.header h1{font-size:24px;color:#1e293b}.header .subtitle{font-size:14px;color:#64748b;margin-top:5px}.header .company{font-size:12px;color:#94a3b8;margin-top:3px}.section{margin-bottom:24px}.section h2{font-size:16px;color:#2563eb;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid #e2e8f0}.item{margin-bottom:6px;font-size:14px}.label{font-weight:600;color:#475569}.content{font-size:14px;color:#334155}.list{list-style:none;padding-left:0}.list li{font-size:14px;padding:4px 0;padding-left:20px;position:relative}.list li:before{content:'\\25B8';position:absolute;left:0;color:#2563eb}.list li.done{text-decoration:line-through;color:#94a3b8}.footer{margin-top:40px;padding-top:15px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8}</style>
</head><body><div class="header"><h1>${opts.title}</h1>${opts.subtitle ? `<div class="subtitle">${opts.subtitle}</div>` : ''}${opts.companyName ? `<div class="company">${opts.companyName}</div>` : ''}</div>${sectionsHtml}<div class="footer">Documento gerado por Caminho HRTech &bull; ${new Date().toLocaleString('pt-BR')}</div></body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
  }, 500)
}
