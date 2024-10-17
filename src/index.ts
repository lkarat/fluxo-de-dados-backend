import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id
        const result = accounts.find((account) => account.id === id)

        if (result === undefined) {

            res.statusCode = 404


            throw new Error("Conta não encontrada. Verifique o 'id'.")

        }


        res.status(200).send(result)



    } catch (error: any) {
        res.send(error.message)
    }

})


app.delete("/accounts/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const accountIndex = accounts.findIndex((account) => account.id === id)

        console.log(accountIndex);

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
        }

        if (accountIndex === -1) {
            res.statusCode = 404

            throw new Error("Id não encontrado")
        }

        res.status(200).send("Item deletado com sucesso")

    } catch (error: any) {
        res.send(error.message)

    }

})



app.put("/accounts/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const newOwnerName = req.body.ownerName as string | undefined
        const newBalance = req.body.balance as number | undefined
        let newType = req.body.type as ACCOUNT_TYPE | undefined

        const account = accounts.find((account) => account.id === id)

        if (!account) {

            res.statusCode = 404
            console.log("estou dentro do erro de não encontrado");
            

            throw new Error ("Account não encontrada")

        }

        if (typeof newBalance !== 'number' || newBalance <= 0) {

            res.statusCode = 406

            throw new Error ("Valor do Balanço menor ou igual a zero. Deve ser positivo. Tente de novo")
        }



        if (newType !== ACCOUNT_TYPE.GOLD && ACCOUNT_TYPE.PLATINUM && ACCOUNT_TYPE.BLACK) {

        
            res.statusCode = 406

            throw new Error ("Vossa Excelência colocou um tipo inexistente de conta. Favor refazer a operação, utilizando 'Ouro', 'Platina' ou 'Black'")

        }

        if (account) {

            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type
            account.balance = isNaN(newBalance) ? account.balance : newBalance
           

        }
        res.status(200).send("Atualização realizada com sucesso")

       

    } catch (error) { 

        console.log(error) 
    
     
    
        if (res.statusCode === 200) { 
    
            res.status(500) 
    
        } 
    
    // adicionamos um fluxo de validação do parâmetro 'error' 
    
        if (error instanceof Error) { 
    
            res.send(error.message) 
    
        } else { 
    
            res.send("Erro inesperado") 
    
        } 
    
    } 

})