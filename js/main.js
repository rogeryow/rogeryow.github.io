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

class Page {
	size = {
		a4: [612, 950],
		legal: [612, 950],
		short: [612, 950],
	}
	leftMargin = 45
	constructor(format = 'a4', orientation = 'p') {			
		if (this.size.hasOwnProperty(format)) {
			switch(orientation) {
				case 'p':
					this.format = this.size[format]
				break;
				case 'l':
	 				this.landscape = [this.size[format][1], this.size[format][0]]
	 				this.format = this.landscape
				break;
				default:
				// code block
			}
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
	alignRight() {
		return this.format[0] - this.leftMargin
	}
	alignCenter() {
		return this.format[0]/2
	}
}

function docAddGovHeader(doc, title) {
	offsetY = 50
	strSpacing = 15
	strHeadMargin = 30
	// doc.addImage(img.govLogo, 'PNG', page.alignLeft(), 42, 80, 80)
	doc.addImage(img.govLogo, 'PNG', page.alignCenter()-261, 42, 80, 80)
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
	let header = title 
	doc.text(header, page.alignCenter(), offsetY+78, 'center')
	doc.text(drawUnderline(doc.getTextWidth(header) -5), page.alignCenter(), offsetY+78, 'center')
	setSizeAndFont(12, 'normal')
	let strDate = 'Date: ______________'
	let strDateSize = doc.getTextWidth(strDate)
	doc.text(strDate, page.getWidth()-(strDateSize+page.leftMargin), offsetY+95,)

}

function drawUnderline(width) {
	let line = '_'
	let textWidth = Math.round(width)
	let lineSize = Math.round(doc.getTextWidth(line))
	let totalLines = Math.round(textWidth / lineSize) 
	let underline = ''
	
	for (i = 0; i <= totalLines; i++) {
		underline += line
	}	

	doc.setFontStyle('normal')
	return underline
}

function setSizeAndFont(size, type){
	fontSize = size || 12
	fontType = type || 'normal'
	doc.setFontSize(fontSize)
	doc.setFontType(fontType)
}

docs.sss = function() {
	page = new Page('legal')
	doc = new jsPDF('portrait', 'pt', page.format)

	docAddGovHeader(doc, 'SOCIAL SERVICES')
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
		Object.entries(row).forEach(([key, value]) => {
			let numeral = arrNumerals[index+2] + '.'
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

	doc.setFontType('normal')
	let tableLastY = doc.previousAutoTable.finalY
	let prevTable = doc.previousAutoTable.finalY - 30 
	console.log(tableLastY)
	if(tableLastY > 850) {
		prevTable = 0
		doc.addPage()	
	}

	let name1 = sss.signature[0]
	let name1Width = doc.getTextWidth(name1)
	doc.text('Noted by:', page.alignLeft(), prevTable + 60)
	doc.text(name1, page.alignLeft(), prevTable + 100)
	doc.text(drawUnderline(name1Width), page.alignLeft(), prevTable + 100)
	doc.text('Program Head', page.alignLeft()+name1Width/2, prevTable + 114, 'center')

	let name2 = sss.signature[1]
	let name2Width = doc.getTextWidth(name2)
	doc.text('Prepared by:', page.alignRight()-name2Width, prevTable + 60)
	doc.text(name2, page.alignRight(), prevTable + 100, 'right')
	doc.text(drawUnderline(name2Width), page.alignRight(), prevTable + 100, 'right')
	doc.text('Social Worker', page.alignRight()-name2Width/2, prevTable + 114, 'center')
	
	addPageNumber(40)

	return doc
}

docs.ss = function() {
	page = new Page('legal')
	doc = new jsPDF('portrait', 'pt', page.format)
	docAddGovHeader(doc)
	doc.setFontType('bold')
	doc.text('Name of Client/Representative:',page.alignLeft() ,200)
	doc.setFontType('normal')
	doc.text('____________________________________________________',page.alignLeft()+178 ,200)
	doc.text('Date of Birth:___________Place of Birth:___________Age:___Sex:___Civil Status:____________', page.alignLeft(), 230)

	return doc
}

docs.school = function() {
	page = new Page('legal', 'l')
	doc = new jsPDF('landscape', 'pt', page.format)
	docAddGovHeader(doc, 'EDUCATIONAL ASSISTANCE LIST')

	let addMargin = 40
	doc.setFontType('bold')
	// old 165, 190
	doc.text(school.name, page.alignCenter()-40 + addMargin, 167, 'center')
	doc.setFontType('normal')
	doc.text(school.header, page.alignCenter()-40 + addMargin, 183, 'center')

	doc.autoTable({
		startY: 200,
		margin: { left: 85 },
		head: [
		[['ID'], ['Name'], ['Address'], ['Course'], ['Year'], ['Amount'], ['Remarks']]
		],
		body: school.arrUsers,
		theme: 'grid',	
		headStyles:{
			fillColor: '#f2f2f2',
			cellPadding: 5,
			halign: 'center',
        	valign: 'middle',
		},
		styles: {
			overflow: 'linebreak',
			halign: 'justify',
			fontSize: 9,
			cellPadding: 3,
			valign: 'middle',
			halign: 'center',
			textColor: '#000',
		},
		willDrawCell: function (data) {
	        let rows = data.table.body;
	        if (data.row.index === rows.length - 1) {
	        	doc.setFontType('bold')
	            doc.setFillColor(241, 241, 241);
	        }
    	},
	})
	let tableLastY = doc.previousAutoTable.finalY

	doc.setFontType('normal')
	let prevTable = doc.previousAutoTable.finalY - 30 

	if(tableLastY > 500) {
		prevTable = 0
		doc.addPage()	
	}
	let name1 = school.signature[0]
	let name1Width = doc.getTextWidth(name1)
	doc.text('Prepared By:', page.alignLeft() + addMargin, prevTable + 60)
	doc.text(name1, page.alignLeft() + addMargin, prevTable + 100)
	doc.text(drawUnderline(name1Width), page.alignLeft() + addMargin, prevTable + 100)
	doc.setFontType('bold')
	doc.text('EXECUTIVE ASSISTANT', page.alignLeft()+ name1Width/2 + addMargin, prevTable + 114, 'center')

	let name2 = school.signature[1]
	let name2Width = doc.getTextWidth(name2)
	doc.setFontType('normal')
	doc.text('Approved by:', page.alignRight()-name2Width, prevTable + 60)
	doc.text(name2, page.alignRight(), prevTable + 100, 'right')
	doc.text(drawUnderline(name2Width), page.alignRight(), prevTable + 100, 'right')
	doc.setFontType('bold')
	doc.text('MAYOR', page.alignRight()-name2Width/2, prevTable + 114, 'center')

	let x = 84
	addPageNumber(x)

	return doc
}

function addPageNumber(x, y) {
	let height = doc.internal.pageSize.getHeight()
	let pageX = x || 40
	let pageY = y || height - 20
	doc.setFontType('normal')
	var pageCount = doc.internal.getNumberOfPages()
	doc.setTextColor('gray')
	for(i = 0; i < pageCount; i++) { 
		doc.setPage(i); 
		doc.text(pageX, pageY, 'Page ' + doc.internal.getCurrentPageInfo().pageNumber + " of " + pageCount)
	}
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
