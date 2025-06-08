import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


def pytest_addoption(parser):
    parser.addoption("--headless", action="store_true", default=False, help="Run tests in headless mode")


@pytest.fixture(scope="session")
def browser(request):
    headless = request.config.getoption("--headless")
    chrome_options = Options()

    if headless:
        chrome_options.add_argument("--headless=new")

    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )

    yield driver
    driver.quit()


@pytest.fixture
def login_page(browser):
    browser.get("http://localhost:3000/login")
    WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".login_modal-content"))
    )
    return browser