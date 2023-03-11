const express = require('express')
const mysql = require('mysql')

const app = express()

app.use(express.json())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tax_details',
  port: 3307
})

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database: ' + err.message);
        return;
      }
      console.log('Connected to MySQL database!');
})

app.post('/sup_details', (req,res) => {
    const {osup_det1_txval, osup_det1_csamt, osup_det1_iamt, osup_det1_camt, osup_det1_samt, osup_det2_txval, osup_det2_iamt, osup_det2_csamt, osup_nil_exmp_txvl, isup_rev_txval, isup_rev_csamt, isup_rev_iamt, isup_rev_camt, isup_rev_samt, osup_nongst_txval} = req.body;

    const sql = 'INSERT INTO sup_details (date, osup_det1_txval, osup_det1_csamt, osup_det1_iamt, osup_det1_camt, osup_det1_samt, osup_det2_txval, osup_det2_iamt, osup_det2_csamt, osup_nil_exmp_txvl, isup_rev_txval, isup_rev_csamt, isup_rev_iamt, isup_rev_camt, isup_rev_samt, osup_nongst_txval) VALUES (CURDATE(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const sql2 = `UPDATE sup_details SET total_amt = osup_det1_txval+ osup_det1_csamt+ osup_det1_iamt+ osup_det1_camt+ osup_det1_samt+ osup_det2_txval+ osup_det2_iamt+ osup_det2_csamt+ osup_nil_exmp_txvl+ isup_rev_txval+ isup_rev_csamt+ isup_rev_iamt+ isup_rev_camt+ isup_rev_samt+ osup_nongst_txval WHERE date = CURDATE()`;
    connection.query(sql, [osup_det1_txval, osup_det1_csamt, osup_det1_iamt, osup_det1_camt, osup_det1_samt, osup_det2_txval, osup_det2_iamt, osup_det2_csamt, osup_nil_exmp_txvl, isup_rev_txval, isup_rev_csamt, isup_rev_iamt, isup_rev_camt, isup_rev_samt, osup_nongst_txval], (err, result) => {
        if (err) {
            console.log('Error inserting record into MySQL: ' + err.message);
            return res.status(500).json({ error: 'Error inserting record into MySQL!' });
          }
          connection.query(sql2, (err, result) => {
            if (err) {
                console.log('Error adding sum: ' + err.message);
              }
              console.log('Added sum into MySQL successfully!');
              console.log(result)
        })

          console.log('Record inserted into MySQL successfully!');
          return res.status(200).json({ message: 'Record inserted into MySQL successfully!' });
    })
    
    
})

app.listen(3300, () => {
    console.log('Server started on port 3300!');
  });