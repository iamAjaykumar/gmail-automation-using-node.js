const puppeteer= require('puppeteer')
const cookies=require('./cookies.json')
const fs=require('fs')
const credentials=require('./credentials')


async function webcookie(){

    const browser= await puppeteer.launch({headless: false,  args: [ '--proxy-server=http://10.10.10.10:8000' ]
})
    const page= await browser.newPage()
    if(Object.keys(cookies).length){
        console.log('There are some cookies')
        //set the cookie array to the page and redirect to the page 
        await page.setCookie(...cookies)
        await page.goto('https://mail.google.com/mail/u/0/#inbox',{waitUntil:'networkidle2'})
    }
    else{
        console.log('There are no cookies')
        let url='https://accounts.google.com/signin/v2/identifier?hl=en&continue=https%3A%2F%2Fmail.google.com%2Fmail&service=mail&ec=GAlAFw&flowName=GlifWebSignIn&flowEntry=AddSession'
        await page.goto(url,)  

        // enter the user name
        await page.type('[name=identifier]',credentials['username']) 
        await page.click('[jsname=V67aGc]')
        await page.waitForNavigation({waitUntil:'networkidle0'})
        await page.waitForTimeout(3000)
        await page.type('[name=password]',credentials['password'])
        //used class name
        await page.click('.VfPpkd-vQzf8d')
        await page.waitForNavigation()

        //get the cookies if not present
        let current= await page.cookies()
        console.log(current)
        fs.writeFileSync('./cookies.json',JSON.stringify(current))

    }
    await page.waitForTimeout(5000)
    await browser.close()




}

webcookie()