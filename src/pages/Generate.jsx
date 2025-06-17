
import React from 'react'
import { useLocation } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'; 

import { Card, CardContent, Typography, Box, Stack, Button } from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';
function Generate() {
    const data = useLocation()
    const qrValue = data.state?.transaction_no

    const downloadPDF = async () => {
  
    //console.log(isSubmit);
  
    // Create a new PDF document using pdf-lib
    const pdfDoc = await PDFDocument.create();
  
    // Letter size in points: 612 x 792 (8.5 x 11 inches)
    const pageWidth = 612;
    const pageHeight = 792;
  
    // Loop through the clientData array
   
  
      // Process the first page
      let element = document.getElementById(`ToPrint`);
      if (element) {
        let canvas = await html2canvas(element, { scale: 2, quality: 0.95 });
        let imgData = canvas.toDataURL('image/jpeg'); // Use JPEG for smaller file size
        const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());
        
        const img = await pdfDoc.embedJpg(imgBytes); // Embed the image
        const { width: imgWidth, height: imgHeight } = img.scale(1); // Get original image dimensions
  
        // Calculate scale factor to fit image within Letter size page
        const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  
        const scaledImgWidth = imgWidth * scaleFactor;
        const scaledImgHeight = imgHeight * scaleFactor;
  
        const page = pdfDoc.addPage([pageWidth, pageHeight]); // Use Letter size for pages
        const { width, height } = page.getSize();
  
        // Add the image to the first page, starting at the top of the page
        page.drawImage(img, {
          x: (pageWidth - scaledImgWidth) / 2, // Center the image horizontally
          y: pageHeight - scaledImgHeight, // Set the image to start at the top of the page
          width: scaledImgWidth,
          height: scaledImgHeight,
        });
      } else {
        //console.error(`Element ToPrint not found!`);
      }
  
      // Wait a bit for the second element to render
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // Process the second page
      let secondElement = document.getElementById(`toPrintPage2`);
      //console.log(`Second element (toPrintPage2}):`, secondElement);  // Debugging line
  
      if (secondElement) {
        let canvas = await html2canvas(secondElement, { scale: 2, quality: 0.95 });
        let imgData = canvas.toDataURL('image/jpeg'); // Use JPEG for smaller file size
        const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());
        
        const img = await pdfDoc.embedJpg(imgBytes); // Embed the image
        const { width: imgWidth, height: imgHeight } = img.scale(1); // Get original image dimensions
  
        // Calculate scale factor to fit image within Letter size page
        const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  
        const scaledImgWidth = imgWidth * scaleFactor;
        const scaledImgHeight = imgHeight * scaleFactor;
  
        const page = pdfDoc.addPage([pageWidth, pageHeight]); // Add a new page with Letter size
        const { width, height } = page.getSize();
  
        // Add the second page image, starting at the top of the page
        page.drawImage(img, {
          x: (pageWidth - scaledImgWidth) / 2, // Center the image horizontally
          y: pageHeight - scaledImgHeight, // Set the image to start at the top of the page
          width: scaledImgWidth,
          height: scaledImgHeight,
        });
      } else {
        //console.error(`Element toPrintPage2 not found!`);
      }
    
  
    // Finalize the PDF document
    const pdfBytes = await pdfDoc.save();
    
    // Download the generated PDF
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${data.state?.transaction_no}.pdf`;
    a.click();
  
  };

  return (
    <Box>
        <div id='ToPrint' >
            <Box sx={{paddingX:"2%",paddingTop:"2%"}}>
        <Typography variant="h6" gutterBottom>
          Scan This
        </Typography>
         <Box sx={{
            borderTop: '5px dashed #000000', // blue dashed border
            borderBottom: '5px dashed #000000', // blue dashed border
            p: 2,
        }}>
    <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
<Card sx={{ maxWidth: 200 }}>
      <CardContent>
        
        <Box display="flex" justifyContent="center" >
          <QRCodeCanvas
            value={qrValue}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </Box>
        
        

      </CardContent>
    </Card>
    <Box>
        <Typography sx={{fontSize:24}}>Transaction No: {data.state?.document_no}</Typography>
        <Typography sx={{fontSize:24}}>Document Name: {data.state?.document_name}</Typography>
        <Typography sx={{fontSize:24}}>Document Desc: {data.state?.document_desc}</Typography>
    </Box>
    <Box>
            <Typography sx={{fontSize:24}}>{data.state?.transaction_status}</Typography>
        </Box>
    </Stack>
    
    
    </Box>   
            </Box>
        
        
        </div>
        
       
     <Box sx={{paddingTop:2}}>
        <Stack direction="row-reverse">
        <Button variant='contained' onClick={downloadPDF} sx={{width:"10%"}}>Print</Button>
        </Stack>
        
     </Box>
    </Box>
   
  )
}

export default Generate