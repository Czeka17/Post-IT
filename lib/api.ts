export async function createUser(email:string,name:string,password:string){
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify({email, name, password}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	
	const data = await response.json();

	if(!response.ok){
		throw new Error(data.message || 'Something went wrong!')
	}

	return data;
}

