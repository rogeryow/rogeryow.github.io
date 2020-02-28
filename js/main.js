const docs = {}	
const arrNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI']
const btnPdf = document.getElementById('btnPDF')	
const selDoc = document.getElementById('selDoc')
const iframePdfId = 'iframePDF'
const strHeadIct = 'INFORMATION AND COMMUNICATION TECHNOLOGY DIVISION'
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
					let width = this.size[format][1]
					let height = this.size[format][0]
	 				this.landscape = [width, height]
	 				this.format = this.landscape
				break;
				default:
			}
		}else {
			// default
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

function docAddGovHeader(doc, option) {	
	let dispTitle = option.title || ''
	let fontSizeTitle = option.fontSizeTitle || 14 
	let pageWidth = getPageWidth()
	let pageCenter = pageWidth/2
	let addMoreUnderLine = option.addMoreUnderLine || 0
	let dispDate = typeof option.date !== 'undefined' ? option.date : true
	let yMargin = option.yMargin || 0
	console.log(option)
	console.log(yMargin)
	offsetY = 50
	strSpacing = 15
	strHeadMargin = 30
	leftMargin = 45
	// original page header
	// doc.addImage(img.govLogo, 'PNG', pageCenter-261, 42, 80, 80)
	doc.addImage(img.govLogo, 'PNG', pageCenter-261, 30 + yMargin, 80, 80)
	doc.setFontSize(11)
	doc.text('Republic of the Philippines', pageCenter, offsetY + yMargin, 'center')
	doc.text('Province of Davao del Sur', pageCenter, offsetY + 14 + yMargin, 'center')
	doc.setFontType('bold')
	doc.text('CITY OF DIGOS', pageCenter, offsetY + 31 + yMargin, 'center')
	doc.setFontSize(14)
	doc.text('OFFICE OF THE CITY MAYOR', pageCenter, offsetY + 48 + yMargin, 'center')
	doc.setFontSize(11)
	doc.text('CITY SPECIAL PROGRAM AND MANAGEMENT OFFICE', pageCenter, offsetY + 62 + yMargin, 'center')
	
	doc.setFontSize(fontSizeTitle)
	doc.text(dispTitle, pageCenter, offsetY+78, 'center')
	doc.text(drawUnderline(doc.getTextWidth(dispTitle) -5 + addMoreUnderLine), pageCenter, offsetY + 78 + yMargin, 'center')
	setSizeAndFont(12, 'normal')

	if(dispDate) {
		let strDate = 'Date: ______________'
		let strDateSize = doc.getTextWidth(strDate)
		doc.text(strDate, pageWidth-(strDateSize+leftMargin), offsetY+95 + yMargin)
	}

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
	option = {
		title: 'SOCIAL SERVICES',
	}
	docAddGovHeader(doc, option)
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
	
	let pageNumberX = 44
	addPageNumber(pageNumberX)

	return doc
}

docs.ss = function() {
	// page = new Page('legal')
	doc = new jsPDF('portrait', 'pt', 'legal')
	let option = {
		title: 'Social Service',
	}
	docAddGovHeader(doc, option)
	doc.setFontType('bold')
	doc.text('Name of Client/Representative:',page.alignLeft() ,200)
	doc.setFontType('normal')
	doc.text('____________________________________________________',page.alignLeft()+178 ,200)
	doc.text('Date of Birth:___________Place of Birth:___________Age:___Sex:___Civil Status:____________', page.alignLeft(), 230)

	console.log(getPageDim())
	return doc
}

docs.school = function() {
	page = new Page('legal', 'l')
	doc = new jsPDF('landscape', 'pt', page.format)
	let option = {
		title: 'EDUCATIONAL ASSISTANCE LIST',
	}
	docAddGovHeader(doc, option)

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

	let pageNumberX = 84
	addPageNumber(pageNumberX)

	return doc
}

docs.dtr = function() {
	doc = new jsPDF('portrait', 'pt', 'a4')
	option = {
		title: strHeadIct,
		date: false,
		fontSizeTitle: 12,
		addMoreUnderLine: 20,
	}
	docAddGovHeader(doc, option)

	let leftMargin = 40

	doc.setFontType('bold')
	doc.text('Daily Time Record', getPageCenter(), 170, 'center')
	
	setSizeAndFont(11, 'bold')
	doc.text('Name: ', leftMargin, 210)
	setSizeAndFont(11, 'normal')
	doc.text('Roger PAntil', leftMargin + 40, 210)

	setSizeAndFont(11, 'bold')
	doc.text('Start Date: ', leftMargin, 225)
	setSizeAndFont(11, 'normal')
	doc.text('1/1/2020', leftMargin + 60, 225)

	setSizeAndFont(11, 'bold')
	doc.text('End Date: ', leftMargin, 240)
	setSizeAndFont(11, 'normal')
	doc.text('1/31/2020', leftMargin + 60, 240)

	let imgQrCode = img.qrCodeSamp
	doc.addImage(imgQrCode, 'PNG', getPageWidth()-90, 200, 45, 45)
	
	doc.autoTable({
		startY: 270,
		headStyles:{
			fillColor: '#ffffff',
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
		theme: 'striped',	
		head: [
			[[''], ['IN'], ['OUT'], ['IN'], ['OUT'], ['IN'], ['OUT']]
		],
		body: [
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], ['7:30 PM'], ['1:30 AM']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], ['7:30 PM'], ['1:30 AM']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], ['7:30 PM'], ['1:30 AM']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], ['7:30 PM'], ['1:30 AM']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], ['7:30 PM'], ['1:30 AM']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
			[['1/1/2020 We'], ['7:53 AM'], ['12:08 PM'], ['12:57 PM'], ['5:08 PM'], [''], ['']],
		],

	})

	addPageNumber()

	return doc
}

docs.guaranteeLetter = function() {
	page = new Page('legal')
	doc = new jsPDF('portrait', 'pt', page.format)

	function tempGuaranteeLetter(option, margin) {
		docAddGovHeader(doc, option)
		doc.text('______________________________________________________________________________', page.leftMargin, 120 + margin)
		doc.text('Control No.____________', page.leftMargin, 140 + margin)
		
		
		doc.text(guaranteeLetter.controlNum, page.leftMargin + 100, 140 + margin, 'center')
		doc.setFontType('bold')
		setSizeAndFont('13', 'bold')
		doc.text('Guarantee Letter', page.alignCenter() , 140 + margin, 'center')

		setSizeAndFont('12', 'normal')
		doc.text('Date:_____________', page.alignRight() - 3 , 140 + margin, 'right')
		doc.text(guaranteeLetter.date, page.alignRight() - 19 , 140 + margin, 'right')
		setSizeAndFont('12', 'normal')

		doc.text('_____________________', page.alignLeft(), 175 + margin)
		doc.text('_____________________', page.alignLeft(), 195 + margin)
		doc.text('_____________________', page.alignLeft(), 215 + margin)
		
		doc.text(guaranteeLetter.one, page.alignLeft() + 70, 175 + margin, 'center')
		doc.text(guaranteeLetter.two, page.alignLeft() + 70, 195 + margin, 'center')
		doc.text(guaranteeLetter.three, page.alignLeft() + 70, 215 + margin, 'center')

		doc.text("This is to inform you that the city Mayor's has approved financial assistance in the form of this", page.alignLeft(), 250 + margin)
		doc.text('guarantee letter for the __________________________ of patient ________________________', page.alignLeft(), 265 + margin)
		doc.text(guaranteeLetter.type, page.alignLeft() + 210, 265 + margin, 'center')
		doc.text(guaranteeLetter.name, page.alignLeft() + 433, 265 + margin, 'center')

		doc.text("in the amount of __________________________________________________, (___________).", page.alignLeft(), 280 + margin)
		doc.text('Thank you.', page.alignLeft() + 50, 320  + margin)
		doc.text('Very truly yours,', page.alignRight() - 50, 320 + margin, 'right')
		setSizeAndFont('15', 'bold')
		doc.setFont('arial')
		doc.text('JOSEF F. CAGAS', page.alignRight() - 20, 370 + margin, 'right')
		
		setSizeAndFont('12', 'normal')
		doc.setFont('helvetica')
		doc.text('city mayor', page.alignRight() - 50, 385 + margin, 'right')
	}
	
	tempGuaranteeLetter(option = {date: false, fontSizeTitle: 12}, margin = 0)
	tempGuaranteeLetter(option = {date: false, fontSizeTitle: 12, yMargin: 500}, margin = 500)


	return doc
}

function addPageNumber(x, y) {
	let height = doc.internal.pageSize.getHeight()
	let pageCount = doc.internal.getNumberOfPages()
	let pageX = x || 40
	let pageY = y || height - 25
	doc.setFontType('normal')
	doc.setTextColor('gray')
	doc.setFontSize(10)
	for(i = 0; i < pageCount; i++) { 
		doc.setPage(i); 
		doc.text(pageX, pageY, 'Page ' + doc.internal.getCurrentPageInfo().pageNumber + " of " + pageCount)
	}
}


function getPageWidth() {
	let pageWitdh = doc.internal.pageSize.getWidth()
	return pageWitdh 
}

function getPageHeight() {
	let PageHeight = doc.internal.pageSize.getHeight() 
	return PageHeight
}

function getPageDim() {
	let pageDim = []
	pageDim.push(getPageWidth())
	pageDim.push(getPageHeight())
	return pageDim
}

function getPageCenter() {
	let pageCenter = getPageWidth()/2
	return pageCenter
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
