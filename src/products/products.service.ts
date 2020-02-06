import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer'
@Injectable()
export class ProductsService {
    browser
    constructor(){
        this.init()
    }
    async init(){
        this.browser = await puppeteer.launch();
    }
    getProducts(){
        return  this.products('Ordenadores gaming')
    };
    getCustomProduct(Product:string){
        return  this.products(Product)
    };
    async products(Product){
        try{   
            const page = await this.browser.newPage();
            await page.goto(
                `https://www.amazon.es/?&tag=hydesnav-21&ref=pd_sl_781oit2196_e&adgrpid=55589983189&
                hvpone=&hvptwo=&hvadid=366505385431&hvpos=1t1&hvnetw=g&hvrand=16460705958279548807&hvqmt=e&hv
                dev=c&hvdvcmdl=&hvlocint=&hvlocphy=9061043&hvtargid=kwd-10573980&hydadcr=4855_1809861&gclid=EAIaIQobChMI_
                5Tnk5-k5wIVA4fVCh079AFTEAAYASAAEgIne_D_BwE`,
                { waitUntil: "networkidle2" }
            );
            await page.type(
            "input#twotabsearchtextbox.nav-input",
            ""+Product
            );
            await Promise.all([
            page.waitForNavigation(),
            page.click("input.nav-input")
            ]);
            const products = await page.evaluate(() => {
                let i = 0;
                let price:any = 0;
                const nodeListImg = Array.from(
                document.querySelectorAll("img.s-image")
                ).map((img:any) => {
                !img
                    .closest("div.s-include-content-margin.s-border-bottom")
                    .querySelector("span.a-price-whole")
                    ? (price = "Infinity")
                    : (price = img
                        .closest("div.s-include-content-margin.s-border-bottom")
                        .querySelector("span.a-price-whole").innerText);
                const productLink = img
                    .closest("div.s-include-content-margin.s-border-bottom")
                    .querySelector("a").href;
                const description = img.alt;
                const imgLink = img.src;
                price = Number(price.replace(".", "").replace(",", "."));
                ++i;
                return { i, description, price, imgLink, productLink };
                });
            return nodeListImg;
            });
            const orderedProducts = products
            .sort((a, b) => {
                return a.price > b.price ? -1 : a.price < b.price ? 1 : 0;
                })
                    .filter(value => {
                    return value.price !== null;
                });
        return orderedProducts;
        } catch (e) {
            return e.message;
        }
    }       
}

