var crypto = require('crypto');
var request = require("request");
const pg = require('pg');

// var options = { method: 'GET',
//   url: 'https://qchain.auth0.com/api/v2/users?per_page=100&page=2&include_totals=true',
//   headers: { authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqSXpSVEU1TkRJNFJrRkNOVGRETURCRVJUazFPVEU0TURRNU5FTkZRMEl5T0RWR01VSTVSQSJ9.eyJpc3MiOiJodHRwczovL3FjaGFpbi5hdXRoMC5jb20vIiwic3ViIjoicWcxYVo3NHhCRmZrcGtzaFRpSVFRQ09tN3lzSDdhOWtAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcWNoYWluLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTMzMDcwNzk0LCJleHAiOjE1MzMxNTcxOTQsImF6cCI6InFnMWFaNzR4QkZma3Brc2hUaUlRUUNPbTd5c0g3YTlrIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.2WZcgruqhVGcg4t_eSe36C1phUzdkKA_0wHiO7m9oLzOG1-XB2Vy4wp8hI3-vqMBcbcpzlhjW2aFeCbu0BATmiLwALhvmwHEnp4L4WM1hHGPi0j4WFHAwr9WJs7vLyTyjvyNTNTNpxxDyYhkGZUOaDke3oAU7qmOi0Ahw1R0tFKihgC0nZeGX_8OgHpa6wZ7IABAD1xM9enFnqZJI6lRcWXXg4OlOzQN4_39mVzTPQbGZVMmL3SbpzjvLbPw0CYTZz3Wv_53SbhWh1MaMRiKbSYZrHDBupS5kR5YJd0zmswABwUSbWQUaCkUflMoidgOl6Y2_dNHHIfn51RKkhd0VA'
//           } 
//   };

// request(options, async function (error, response, body) {
//   if (error) throw new Error(error);
//   const users = await JSON.parse(body).users;
//   for( let i = 0 ; i < users.length; i++ ){
//     setTimeout(()=>{
//       //updateUser(users[i]);
//       insert(users[i], i)
//     },i * 500);
//   }
// });


// var updateUser = (user) => {
//   var formData = {
//     app_metadata : { role : "_"+crypto.createHash('md5').update(user.email).digest("hex")}
//   }
//   var updateOptions = {
//     method: 'PATCH',
//     url: encodeURI('https://qchain.auth0.com/api/v2/users/' + user.user_id),
//     headers: {
//       authorization : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqSXpSVEU1TkRJNFJrRkNOVGRETURCRVJUazFPVEU0TURRNU5FTkZRMEl5T0RWR01VSTVSQSJ9.eyJpc3MiOiJodHRwczovL3FjaGFpbi5hdXRoMC5jb20vIiwic3ViIjoicWcxYVo3NHhCRmZrcGtzaFRpSVFRQ09tN3lzSDdhOWtAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcWNoYWluLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTMzMDcwNzk0LCJleHAiOjE1MzMxNTcxOTQsImF6cCI6InFnMWFaNzR4QkZma3Brc2hUaUlRUUNPbTd5c0g3YTlrIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.2WZcgruqhVGcg4t_eSe36C1phUzdkKA_0wHiO7m9oLzOG1-XB2Vy4wp8hI3-vqMBcbcpzlhjW2aFeCbu0BATmiLwALhvmwHEnp4L4WM1hHGPi0j4WFHAwr9WJs7vLyTyjvyNTNTNpxxDyYhkGZUOaDke3oAU7qmOi0Ahw1R0tFKihgC0nZeGX_8OgHpa6wZ7IABAD1xM9enFnqZJI6lRcWXXg4OlOzQN4_39mVzTPQbGZVMmL3SbpzjvLbPw0CYTZz3Wv_53SbhWh1MaMRiKbSYZrHDBupS5kR5YJd0zmswABwUSbWQUaCkUflMoidgOl6Y2_dNHHIfn51RKkhd0VA' 
//     },
//     form: formData
//   }

//   request(updateOptions, (err, res, body)=>{
//     if(err) console.log(err);
//     else {
    
      
//     }
//     console.log(res.statusCode);
//   })
// }

// var insert = (user, i) => {
//   const role = user.app_metadata.role;
//   const email = user.email
//   const pool = new pg.Pool({
//         user: 'admin_roy',
//         host: 'qchain-marketplace-db.cztibzh44icj.us-east-2.rds.amazonaws.com',
//         database: 'Qchain_marketplace',
//         password: 'QqD79o69iWwc72mRF3Xj2',
//         port: 5432
//       });
//       const create_role_query = 'CREATE ROLE ' + role;
//       const grant_auth_query = 'GRANT authenticated TO ' + role;
//       const grant_to_unauth_query = 'GRANT '+ role +' TO unauthenticated';
//       const insert_to_account_table = "INSERT INTO ACCOUNT (name, email, role) VALUES ($1::text, $2::text, $3::text);";
//       const values = [email.substring(0, email.lastIndexOf("@")), email, role];
    
//       pool.query(create_role_query)
//         .then(()=>{
//           return pool.query(grant_auth_query);
//         })
//         .then(()=>{
//           return pool.query(grant_to_unauth_query);
//         })
//         .then(()=>{
//           return pool.query(insert_to_account_table, values);
//         })
//         .then(()=>{
//           console.log('OK ' + i);
//           return pool.end();
//         })
//         .catch((err)=>{
//           console.log(err);
//           console.log(user.user_id);
//           pool.end();
//         });
// }