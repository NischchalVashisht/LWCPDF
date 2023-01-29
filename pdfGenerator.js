import { LightningElement, api,wire,track } from "lwc";
import { NavigationMixin } from 'lightning/navigation';
import jspdf from "@salesforce/resourceUrl/jspdf";
import tempCanvas from "@salesforce/resourceUrl/HTML2CANVAS1";
import logo from "@salesforce/resourceUrl/horse";
import { loadScript } from "lightning/platformResourceLoader";


export default class PdfGenerator extends NavigationMixin(LightningElement) {

    @api recordId
    docData = []
    logoImage = logo
    imgsrc=''
    
    error
    ids = ''
    
    @track userData = [
        { name: 'John Doe', email: 'johndoe@example.com', phone: '555-555-5555' },
        { name: 'Jane Smith', email: 'janesmith@example.com', phone: '555-555-5556' },
        { name: 'Bob Johnson', email: 'bobjohnson@example.com', phone: '555-555-5557' },
    ];


    renderedCallback() {
        console.log('logoImage '+this.logoImage)
        Promise.all([
            loadScript(this, jspdf),
            loadScript(this,tempCanvas).then(() => {
                console.log('html2canvas loaded');
                
            })
        ]).then(() => {
            console.log('Files loaded.New');
           
        }).catch(error => {
            console.log("Error in rendered call back");
        });
    }

    handleClick(event){
        var elementHTML = this.template.querySelector(".mainclass");
    }

   /* handleClick(event){
        var elementHTML = this.template.querySelector(".mainclass");
      //  var manualHTML = this.template.querySelector(".test");
      //  manualHTML.innerHTML = elementHTML.innerHTML
       
        console.log('1'+elementHTML)
        console.log('html2canvas '+html2canvas)
        this.imgsrc = '';

       
       /* html2canvas(this.template.querySelector('.Main'), {
            logging: true,
            profile: true,
            useCORS: true}).then(function(canvas) {
        var data = canvas.toDataURL('image/jpeg', 0.9);
        var src = encodeURI(data);
        console.log('src is  '+src)
            }); // here 
       html2canvas(this.template.querySelector(".mainclass"),{ 
            scale: "5",
            onrendered: (canvas)=> {
                //show image
                console.log('MainClass '+canvas)
             var myCanvas = this.template.querySelector('.my_canvas_id');
                var ctx = myCanvas.getContext('2d');
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                var img = new Image;
                img.onload = function(){
                    ctx.drawImage(img,0,0,270,350); // Or at whatever offset you like
                };
                console.log('img >> ', canvas.toDataURL());
                img.src = canvas.toDataURL();
                this.imgsrc = img.src; 
            }
        });
    }*/


   /* handleClick(event){
        console.log('1')
        window.jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF();
        console.log('2'+doc)
       
    // Source HTMLElement or a string containing HTML.
        var elementHTML = this.template.querySelector(".mainclass");
        console.log('3'+elementHTML)
        
         doc.html(elementHTML, {
              callback: function(doc) {
            // Save the PDF
           doc.save('document-html.pdf');
         },
            margin: [10, 10, 10, 10],
            autoPaging: 'text',
            x: 0,
            y: 0,
            width: 190, //target width in the PDF document
            windowWidth: 675 //window width in CSS pixels
        });
        console.log('4')
       
    }*/

   /* handleClick(event){
        var elementHTML = this.template.querySelector(".mainclass");
        console.log('1'+elementHTML)
        var printWindow = window.open('', '', 'height=400,width=800');
        console.log('2'+printWindow.document+'   '+this.logoImage)    
        
        const myDiv = printWindow.document.createElement('div');
        myDiv.innerHTML = '<html><head><title>DIV Contents1</title></head><body > <div>kk: <img src= '+'https://www.gstatic.com/webp/gallery3/1.png' +'></div> <div>'  +elementHTML.outerHTML+'</div></body></html>';
        console.log('3#'+printWindow.document)
        printWindow.document.body.appendChild(myDiv);
        
        printWindow.print();

        console.log('4')    
        
        
    }*/
  /*  renderedCallback() {
        loadScript(this, pdflib).then(() => {
        });

        console.log('recode ud  ' + this.recordId)
        if (this.recordId) {
            getData({ accountId: this.recordId })
                .then((result) => {
                    this.docData = JSON.parse(JSON.stringify(result));
                    console.log('Size of File are ' + this.docData.length)
                    this.error = undefined;
//                   this.createPdf()
                })
                .catch((error) => {
                    console.log('error while calling ' + error)
                }
                )
        }
    }

    async createPdf() {
        const pdfDoc = await PDFLib.PDFDocument.create();
        console.log('pdfDoc is ', pdfDoc)
        if (this.docData.length < 1)
            return


        var tempBytes = Uint8Array.from(atob(this.docData[0]), (c) => c.charCodeAt(0));
        console.log('tempBytes', tempBytes)
        const [firstPage] = await pdfDoc.embedPdf(tempBytes);
        const americanFlagDims = firstPage.scale(0.99);
        var page = pdfDoc.addPage();
        console.log('page is ', page)

        page.drawPage(firstPage, {
            ...americanFlagDims,
            x: page.getWidth() - americanFlagDims.width,
            y: page.getHeight() - americanFlagDims.height - 10,
        });


        if (this.docData.length > 1) {
            for (let i = 1; i < this.docData.length; i++) {
                tempBytes = Uint8Array.from(atob(this.docData[i]), (c) => c.charCodeAt(0));
                console.log('tempBtes>> ', tempBytes)
                page = pdfDoc.addPage();
                const usConstitutionPdf = await PDFLib.PDFDocument.load(tempBytes);
                console.log('After ', usConstitutionPdf, usConstitutionPdf.getPages())
                const preamble = await pdfDoc.embedPage(usConstitutionPdf.getPages()[0]);
                console.log(' Inside page is ', page)

                const preambleDims = preamble.scale(0.95);

                page.drawPage(preamble, {
                    ...preambleDims,
                    x: page.getWidth() - americanFlagDims.width,
                    y: page.getHeight() - americanFlagDims.height - 10,
                });
            }

        }
        const pdfBytes = await pdfDoc.save();
        this.saveByteArray("My PDF", pdfBytes);
    }
    saveByteArray(pdfName, byte) {
        var blob = new Blob([byte], { type: "application/pdf" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        var fileName = pdfName;
        link.download = fileName;
        link.click();
    }

    navigateToFiles() {
        this[NavigationMixin.Navigate]({
          type: 'standard__namedPage',
          attributes: {
              pageName: 'filePreview'
          },
          state : {
              recordIds: this.ids,
              
          }
        })
      }*/
}
