/**
 * Common utilities for this app
 * ----------------------------------------------
 * Created by - Lakshya Dev
 * Created on - 02-April-2020
 * 
 * Available utils: 
 */

 /************************************************************************************/

 /** Returns current date-time as a stamp or string.
  * @param {boolean} getAsStamp Return date time as a stamp '{date_time}'. If empty, it defaults to true.
  */
 function getCurrentDateTime(getAsStamp = true){
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = getAsStamp ? `{${date}_${time}}` : `${date} ${time}`;

    return dateTime;
 }

 /************************************************************************************/
 module.exports = {
     getCurrentDateTime
 }