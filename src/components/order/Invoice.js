import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
  CardActions,
  Button,
} from '@mui/material';
import './Invoice.css'; // External CSS for print styles

export default function Invoice({orderDetails}) {
  const [showInvoice, setShowInvoice] = useState(false); // State to control invoice visibility
  const invoiceRef = useRef(); // Reference to the invoice

  const handlePrint = () => {
    setShowInvoice(true); // Show the invoice when printing
    setTimeout(() => {
      window.print(); // Trigger the print dialog after the invoice is shown
      setShowInvoice(false); // Hide the invoice again after printing
    }, 100); // Short delay to ensure the invoice is rendered before printing
  };



  return (
    <div>
      {showInvoice && ( // Conditionally render the invoice
        <div ref={invoiceRef} className="invoice-content">
          <div sx={{ mt: 4 }}>

          <div className='m-3 d-flex justify-content-between align-items-center'>
          <div style={{ fontSize: "70px", fontWeight: "bold" }}>Ai Home Tech</div>
          
          <div style={{ textAlign: "end" }}>
            <div>
              <span>CEO Email: nsakib32@gmail.com</span>
            </div>
            <div>
              <span>CEO Number: 01734700316</span>
            </div>
            <div>
              <span>59/1-A, West Raja Bazar, Panthapath, Dhaka 1215</span>
            </div>
          </div>
        </div>
        
          <hr style={{height:"2px"}} />


            <CardHeader title="Order Invoice" titleTypographyProps={{ variant: 'h4', align: 'center' }} />
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={4}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">Order Details</Typography>
                  <Typography>Order Number: {orderDetails._id}</Typography>
                  <Typography>Date:  { new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }) } </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6" fontWeight="bold">Customer Information</Typography>
                  <Typography>{orderDetails.name}</Typography>
                  <Typography>{orderDetails.phoneNumber}</Typography>
                  <Typography>{orderDetails.address}</Typography>
                  <Typography>{orderDetails.thanaDistrict}</Typography>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{fontWeight:"bold" , fontSize: "16px"}}>Product</TableCell>
                      <TableCell sx={{fontWeight:"bold" , fontSize: "16px"}} align="right">Item Price</TableCell>
                      <TableCell sx={{fontWeight:"bold" , fontSize: "16px"}} align="right">Quantity</TableCell>
                      <TableCell sx={{fontWeight:"bold" , fontSize: "16px"}} align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.product.productName}</TableCell>
                        <TableCell align="right">{product.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{product.qty}</TableCell>
                        <TableCell align="right">{(product.price * product.qty ).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Box width="300px">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{orderDetails.totalAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Shipping cost ( { orderDetails.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে" } )</Typography>
                    <Typography>{orderDetails.shippingCost.toFixed(2)}</Typography>
                  </Box>
                  {
                    orderDetails?.couponAmount !== 0 &&   <div>   <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Coupon:</Typography>
                      <Typography> - {orderDetails.couponAmount.toFixed(2)}</Typography>
                    </Box></div>
                  }
               
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" fontWeight="bold">
                    <Typography sx={{fontWeight:"bold"}}>Total:</Typography>
                    <Typography sx={{fontWeight:"bold"}}>{(  orderDetails.totalAmount + orderDetails.shippingCost - orderDetails.couponAmount).toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>

        {orderDetails.orderNotes && (
  <CardActions>
    <Box width="100%" textAlign="left" py={2}>
      <Typography variant="h6" fontWeight="bold" align="left">Order Notes :</Typography>
      <Typography
        style={{ 
          width: "100%", 
          wordWrap: "break-word", // Allows long words to break onto the next line
          whiteSpace: "pre-wrap"  // Preserves whitespace and breaks lines as needed
        }}
        align="left"
      >
        {orderDetails.orderNotes}
      </Typography>
    </Box>
  </CardActions>
)}

            
            <CardActions>
              <Box width="100%" textAlign="left" py={2}>
                <Typography variant="h6" fontWeight="bold" align="left">Payment Information : </Typography>
                <Typography align="left">{orderDetails.paymentMethod}</Typography>
              </Box>
            </CardActions>
            
          </div>
        </div>
      )}

      {/* Print Button */}
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mt: 2 }} className="no-print">
        Print Invoice
      </Button>
    </div>
  );
}
