import { mockData } from "./paramsMock";


//stall some time
async function stall(stallTime = 2000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
}


function random(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
  
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
  
    return result
  }

export const fakeCallData = async() => {
    const data = getTableData();
    await stall(1000);
    return data;
}

export const fakeCallOptions = async() => {
    const data = getOptions();
    await stall(2000);
    return data;
}

export const fakeParamsChange = async(urlToChange, value) => {
    await stall(5000);
    return value;
}

/**
 * TODO: Get the parameters from server
 * @returns 
 */
const getOptions = () => {
    const params = mockData.map((el) => {
        return {
            id: el.id,
            name: el.tags.map(function(el){
                return el.name;
            }).join("-")
        }
    })
    return params;
}


/**
 * TODO: fetch the actual data from server and format as below
 * @returns 
 */
const getTableData = () => {
    const rows = Array.from(new Array(200)).map(() => {
        const field = random(10 + Math.ceil(Math.random() * 20))
        const params = mockData.map((el) => {
            return {
                id: el.id,
                name: el.tags.map(function(el){
                    return el.name;
                }).join("-")
            }
        })
        const randomElement = params[Math.floor(Math.random() * params.length)];
        return {
          field,  //field name
          value: randomElement //param vaue
        }
      })
    return rows;
  }

  
