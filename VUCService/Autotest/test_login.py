import time
# import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# Тест на успешную авторизацию
def test_successful_login(login_page):
    # Вводим корректные данные
    username_input = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_fields_field input[type='text']")
    password_input = login_page.find_element(By.CSS_SELECTOR,
                                             ".LoginForm_form_fields_field.password input[type='password']")

    username_input.send_keys("test")
    password_input.send_keys("test123")

    # Нажимаем кнопку входа
    login_button = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_button_submit")
    login_button.click()

    # Проверяем редирект на страницу профиля
    WebDriverWait(login_page, 10).until(
        EC.url_to_be("http://localhost:3000/profile")
    )
    assert login_page.current_url == "http://localhost:3000/profile"


# Тест на неправильный логин/пароль
def test_invalid_credentials(login_page):
    # Вводим некорректные данные
    username_input = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_fields_field input[type='text']")
    password_input = login_page.find_element(By.CSS_SELECTOR,
                                             ".LoginForm_form_fields_field.password input[type='password']")

    username_input.send_keys("wrong_user")
    password_input.send_keys("wrong_password")

    # Нажимаем кнопку входа
    login_button = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_button_submit")
    login_button.click()

    # Проверяем отсутствие редиректа
    time.sleep(1)
    assert "profile" not in login_page.current_url

    # Проверяем, что остались на странице логина
    assert login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form").is_displayed()


# Тест на блокировку после 5 попыток
def test_login_blocking(login_page):
    for attempt in range(5):
        username_input = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_fields_field input[type='text']")
        password_input = login_page.find_element(By.CSS_SELECTOR,
                                                 ".LoginForm_form_fields_field.password input[type='password']")

        username_input.clear()
        password_input.clear()

        username_input.send_keys(f"wrong_{attempt}")
        password_input.send_keys("wrong_password")

        login_button = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_button_submit")
        login_button.click()
        time.sleep(0.5)

    # Проверяем сообщение о блокировке
    blocked_message = WebDriverWait(login_page, 5).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".blocked-timer"))
    )
    assert "Повторите через" in blocked_message.text

    # Проверяем, что кнопка заблокирована
    login_button = login_page.find_element(By.CSS_SELECTOR, ".LoginForm_form_button_submit")
    assert not login_button.is_enabled()


