import axios from "axios"
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded"

export function queryBarcodeAPI(barcode) {
    let url = `https://www.mxnzp.com/api/barcode/goods/details?app_id=heiusbhvtiqerkkq&app_secret=Uy9leklYb1VPSyttK0xMYkNQVlpNUT09&barcode=${barcode}`

    if (!barcode) {
        return;
    }

    return axios.get(url)
}


