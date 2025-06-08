import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_admin_panel_header_present(browser):
    browser.get("http://localhost:3000")
    header = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".admin-panel h1"))
    )
    assert header is not None, "Admin Panel header is not present"

def test_tabs_present(browser):
    browser.get("http://localhost:3000")
    tabs = WebDriverWait(browser, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".tabs button"))
    )
    assert len(tabs) > 0, "Tabs are not present"

def test_create_user_form_present(browser):
    browser.get("http://localhost:3000")
    # Click on the "users" tab
    users_tab = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Добавление пользователей')]"))
    )
    users_tab.click()
    # Verify the presence of the "Create User" form
    create_user_form = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".create-user"))
    )
    assert create_user_form is not None, "Create User form is not present"

def test_backup_management_present(browser):
    browser.get("http://localhost:3000")
    # Click on the "backups" tab
    backups_tab = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Управление данными и мониторинг')]"))
    )
    backups_tab.click()
    # Verify the presence of the "Backup Management" section
    backup_management = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".backup-management"))
    )
    assert backup_management is not None, "Backup Management section is not present"

def test_accounts_management_present(browser):
    browser.get("http://localhost:3000")
    # Click on the "accounts" tab
    accounts_tab = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Управление учетными записями')]"))
    )
    accounts_tab.click()
    # Verify the presence of the "Accounts Management" table
    accounts_table = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".accounts-management table"))
    )
    assert accounts_table is not None, "Accounts Management table is not present"

def test_active_requests_present(browser):
    browser.get("http://localhost:3000")
    # Click on the "messages" tab
    messages_tab = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Управление уведомлениями')]"))
    )
    messages_tab.click()
    # Verify the presence of the "Active Requests" section
    active_requests = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".requests-panel"))
    )
    assert active_requests is not None, "Active Requests section is not present"

def test_templates_section_present(browser):
    browser.get("http://localhost:3000")
    # Click on the "Militarymessages" tab
    military_messages_tab = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Управление уведомлениями')]"))
    )
    military_messages_tab.click()
    # Verify the presence of the "Templates" section
    templates_section = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".military-message-active"))
    )
    assert templates_section is not None, "Templates section is not present"