class HomePage {
  constructor(page) {
    this.page = page;
    this.url = 'https://testautomationpractice.blogspot.com/';
    
    // Header
    this.pageTitle = page.locator('h1.title');
    this.pageDescription = page.locator('p.description');
    
    // Navigation links
    this.navHome = page.locator('a:has-text("Home")').first();
    this.navUdemyCourses = page.locator('a:has-text("Udemy Courses")');
    this.navOnlineTrainings = page.locator('a:has-text("Online Trainings")');
    this.navBlog = page.locator('.tabs-outer a:has-text("Blog")');
    this.navPlaywrightPractice = page.locator('a:has-text("PlaywrightPractice")');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async getTitle() {
    return this.pageTitle.textContent();
  }

  async getDescription() {
    return this.pageDescription.textContent();
  }

  async clickNavHome() {
    await this.navHome.click();
  }

  async clickNavUdemyCourses() {
    await this.navUdemyCourses.click();
  }

  async clickNavOnlineTrainings() {
    await this.navOnlineTrainings.click();
  }

  async clickNavBlog() {
    await this.navBlog.click();
  }

  async clickNavPlaywrightPractice() {
    await this.navPlaywrightPractice.click();
  }
}

module.exports = { HomePage };