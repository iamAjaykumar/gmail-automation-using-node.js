const puppeteer= require('puppeteer')
const credentials=require('./credentials')
const fs=require('fs')



async function webcrawl(){
  console.log('openig browser')
  const browser= await puppeteer.launch({headless: false})
  console.log('opening a new tab')
  const page= await browser.newPage()
  await page.setViewport({
    width:640,
    height:480
  })
 
  let url='https://accounts.google.com/signin/v2/identifier?hl=en&continue=https%3A%2F%2Fmail.google.com%2Fmail&service=mail&ec=GAlAFw&flowName=GlifWebSignIn&flowEntry=AddSession'
  await page.goto(url)  

  // enter the user name
  await page.type('[name=identifier]',credentials['username']) 

  await page.click('[jsname=V67aGc]')

  setTimeout(async function()
  {
      //used to element tag names 
      await page.type('[name=password]',credentials['password'])
      //used class name
      await page.click('.VfPpkd-vQzf8d')

      await page.waitForTimeout(8000)

      await page.click('[aria-label=Primary]')

  },8000)
  console.log('finished succesfully')




  setTimeout(async function maildata() 
  {

    const id_values = await page.$$eval("[jscontroller='ZdOxDb']", (options) =>
    options.map(option => option.id)
    );
    
    for(let i=0;i<id_values.length;i++)
    {
      await page.click(`[id='${id_values[i]}']`)
      await page.waitForTimeout(5000)
      console.log(id_values[i])
      var data= await page.evaluate(()=>{
        var b= document.querySelectorAll('.ads.adn')
        return b[0].textContent
    })
 
      fs.appendFile('maildata.txt',data,function(err,response){
        if(err){
          console.log('cannot write data')
        }
        console.log('mail '+i+' Appending mail data to file')
      })

      await page.goBack()
    }
    await browser.close()
    
  },30000)
  
}
webcrawl()





