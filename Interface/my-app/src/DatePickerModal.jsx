// DatePickerModal.jsx
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Modal, Button } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DatePickerModal = ({ show, onClose, onAdd }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateValid, setIsDateValid] = useState(true);

  useEffect(() => {
    if (show) {
      setSelectedDate(new Date());
      setIsDateValid(true);
    }
  }, [show]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDateValid(date >= new Date());
  };

  const handleSubmit = () => {
    if (!isDateValid) return;
    onAdd(selectedDate);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Выбор даты занятия</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="mb-3">
          <label>Дата занятия:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd.MM.yyyy"
            minDate={new Date()}
            className={`form-control ${!isDateValid ? 'is-invalid' : ''}`}
          />
          {!isDateValid && (
            <div className="invalid-feedback">
              Дата не может быть раньше сегодняшнего дня
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DatePickerModal;