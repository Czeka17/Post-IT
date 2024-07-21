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

export async function addUserHandler(username:string, friendname:string) {
    try {
      const response = await fetch('/api/user/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, friendname })
      });
      const data = await response.json();
      console.log(data); 
  
    } catch (error) {
      console.error(error);
    }
  };
  export async function deleteUserHandler(username:string, friendname:string)  {
    try {
      const response = await fetch('/api/user/add-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, friendname})
      });
  
      const data = await response.json();
      console.log(data); 
  
    } catch (error) {
      console.error(error);
    }
  };