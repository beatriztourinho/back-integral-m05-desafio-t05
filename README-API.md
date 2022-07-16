![](https://i.imgur.com/xG74tOh.png)

# Desafio Final Módulo 5 - BACKEND

## Documentação dos Endpoints

---

**Cadastro do Usuário - POST https://charges-be.herokuapp.com/user**

- REQUEST

		{
			"name": "Junim",
			"email": "junim-da-galera@cubos.io",
			"password": "123abc"
		}
	
- RESPONSE
	- Success:

			Status Code: 201
			{
				"message": "Usuário cadastrado com sucesso!"
			}

	- Error:

			Status Code: 400
			{
				"message": "O e-mail informado já foi cadastrado"
			}

			Status Code: 500
			{
				"message": "Ocorreu um erro inesperado: name é um campo obrigatório"
			},
			{
				"message": "Ocorreu um erro inesperado: email deve ser um email válido"
			}
	
---

**Login do Usuário - POST https://charges-be.herokuapp.com/login**

- REQUEST

		{
			"email": "junim-da-galera@cubos.io",
			"password": "123abc"
		}

- RESPONSE
	- Success:

			Status Code: 200
			{
				"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxNjY2N2I4LTFkNmItNGU2Ni1iODQ2LWI5MDRmM2NlZjBiNiIsImlhdCI6MTY1NDQ3NjM3OSwiZXhwIjoxNjU0NTYyNzc5fQ.MGX1tBSN5REF1INEpoTtoFulThLkSjYX7OrfCYHbAbA",
				"user": {
					"name": "Junim",
					"email": "junim-da-galera@cubos.io"
				}
			}

	- Error:

			Status Code: 500
			{
				"message": "Ocorreu um erro inesperado: password é um campo obrigatório"
			},
			{
				"message": "Ocorreu um erro inesperado: email deve ser um email válido"
			}
	
---

**Detalhamento do Usuário - GET https://charges-be.herokuapp.com/user**

- REQUEST


- RESPONSE
	- Success:

			Status Code: 200
			{
				"id": "916667b8-1d6b-4e66-b846-b904f3cef0b6",
				"name": "Junim",
				"email": "junim-da-galera@cubos.io",
				"cpf": null,
				"phone": null,
				"created_at": "2022-06-06T00:21:01.768Z"
			}

---

**Atualização do Usuário - PUT https://charges-be.herokuapp.com/user**

- REQUEST

		{
			"name": "Junim",
			"email": "junim-da-galera@cubos.io",
			"password": "123",
			"cpf": "11122233344",
			"phone": "(71)9999-9999"
		}

- RESPONSE
	- Success:

			Status Code: 200
			{

			}

	- Error:

			Status Code: 404
			{ 
				 
			}
	
---