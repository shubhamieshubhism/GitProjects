exports.LoginPage =class LoginPage{
    constructor(page){
        this.page = page
        this.useranme_textBox =  page.getByRole('textbox', { name: 'Username' })
        this.password_textBox =  page.getByRole('textbox', { name: 'Password' })
        this.login_Button =  page.getByRole('button', { name: ' Login' })
    }

    async gotoLoginPage(){
        await this.page.goto('https://the-internet.herokuapp.com/login');
    }
    
    async login(username,password){
        await this.useranme_textBox.fill(username)
        await this.password_textBox.fill(password)
        await this.login_Button.click()
    }
}