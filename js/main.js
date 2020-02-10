let docs = {}	
let arrNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI']
let btnPdf = document.getElementById('btnPDF')	
let selDoc = document.getElementById('selDoc')
let iframePdfId = 'iframePDF'

selDoc.addEventListener('change', function() {
	pdfToIframe(getPdfSrc(), iframePdfId)
})

function getPdfSrc() { 
	let key = selDoc.options[selDoc.selectedIndex].value
	let src = ''
	if(docs.hasOwnProperty(key)) {
		src = docs[key]()
	}

	return src
}

document.addEventListener('DOMContentLoaded', function() {
	pdfToIframe(getPdfSrc(), iframePdfId)
	// btnPDF.addEventListener('click', function() {
	// 	pdfToIframe(docs.socialService(), 'iframePDF')
	// 	pdfToWindow(docs.socialService())
	// })
})

function getBase64Image(img) {
	let canvas = document.createElement('canvas')
	canvas.width = img.width
	canvas.height = img.height
	let ctx = canvas.getContext('2d')
	ctx.drawImage(img, 0, 0)
	let dataURL = canvas.toDataURL('image/png')
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
}

class pageClass {
	size = {
		a4: [612, 950],
		legal: [612, 950],
		short: [612, 950],
	}
	leftMargin = 45
	constructor(format) {			
		if (this.size.hasOwnProperty(format)) {
			this.format = this.size[format]
		}else {
			this.format = this.size['a4']
		}
	}
	getWidth() {
		return this.format[0]
	}
	getHeight() {
		return this.format[1]
	}
	alignLeft() {
		return this.leftMargin
	}
	alignCenter() {
		return this.format[0]/2
	}
}

function docAddGovHeader(doc) {
	offsetY = 50
	strSpacing = 15
	strHeadMargin = 30
	doc.addImage(img.govLogo, 'PNG', page.alignLeft(), 42, 80, 80)
	doc.setFontSize(11)
	doc.text('Republic of the Philippines', page.alignCenter(), offsetY, 'center')
	doc.text('Province of Davao del Sur', page.alignCenter(), offsetY+14, 'center')
	doc.setFontType('bold')
	doc.text('CITY OF DIGOS', page.alignCenter(), offsetY+31, 'center')
	doc.setFontSize(14)
	doc.text('OFFICE OF THE CITY MAYOR', page.alignCenter(), offsetY+48, 'center')
	doc.setFontSize(11)
	doc.text('CITY SPECIAL PROGRAM AND MANAGEMENT OFFICE', page.alignCenter(), offsetY+62, 'center')
	doc.setFontSize(14)
	let header = 'SOCIAL SERVICES' 
	doc.text(header, page.alignCenter(), offsetY+78, 'center')
	doc.line(page.alignLeft()+198, 131, page.getWidth()-243, 131)
	setSizeAndFont(12, 'normal')
	let strDate = 'Date: ______________'
	let strDateSize = doc.getTextWidth(strDate)
	doc.text(strDate, page.getWidth()-(strDateSize+page.leftMargin), offsetY+95,)
}

function setSizeAndFont(size, type){
	fontSize = size || 12
	fontType = type || 'normal'
	doc.setFontSize(fontSize)
	doc.setFontType(fontType)
}

docs.sss = function() {
	page = new pageClass('legal')
	doc = new jsPDF('portrait', 'pt', page.format)

	docAddGovHeader(doc)
	setSizeAndFont(10, 'bold')
	doc.text('SOCIAL CASE STUDY', page.alignCenter(), offsetY+115, 'center')
	doc.setFontSize(12)
	doc.text('I.', page.alignLeft(), 210)
	doc.text('IDENTIFYING DATA', page.alignLeft()+strHeadMargin, 210)
	setSizeAndFont(12, 'normal')

	sss.arrIntro.map((row, index) => {
		Object.entries(row).forEach(([key,value])=>{
			doc.text(key+': '+value, page.alignLeft()+strHeadMargin, 223+strSpacing*(index+1))
		})
	})

	setSizeAndFont(12, 'bold')
	doc.text('II.', page.alignLeft(), 400)
	doc.text('FAMILY COMPOSITION', page.alignLeft()+strHeadMargin, 400)

	doc.autoTable({
		startY: 415,
		head: [
		[['Name'],['Age'],['Sex'],['Civil Status'],['Occupation'],['Income']]
		],
		body: sss.arrFamily,
		theme: 'grid',	
		headStyles:{
			fillColor: '#f2f2f2',
			cellPadding: 5,
		},
		styles: {
			overflow: 'linebreak',
			halign: 'justify',
			fontSize: 12,
			cellPadding: 5,
			textColor: '#000',
		},

	})

	sss.arrAnswers.map((row, index) => {
		Object.entries(row).forEach(([key, value])=>{
			let numeral = arrNumerals[index+2]
			let title = key
			let answer = []
			answer.push(value)
			let prevTable = doc.previousAutoTable.finalY
			setSizeAndFont(12, 'bold')
			doc.text(numeral, page.alignLeft(), prevTable + 35)
			doc.text(title, page.alignLeft()+strHeadMargin, prevTable + 35)

			doc.autoTable({
				startY: prevTable + 50,
				body: answer,
				theme: 'plain',	
				styles: {
					overflow: 'linebreak',
					halign: 'justify',
					fontSize: 12,
					textColor: '#000',
				},

			})		
		})	
	})
	
	return doc
}

docs.ss = function() {
	page = new pageClass('legal')
	doc = new jsPDF('portrait', 'pt', page.format)
	docAddGovHeader(doc)

	return doc
}

function pdfDownload(doc) {
	doc.save('autoprint.pdf')
}

function pdfToWindow(doc) {
	// doc.autoPrint({letiant: 'non-conform'});
	doc.output('dataurlnewwindow')
}

function pdfToIframe(doc, iframeID) {
	let blob = doc.output('blob')
	let blobURL = URL.createObjectURL(blob)
	iframePDF = document.getElementById(iframeID)
	iframePDF.src = blobURL
}
