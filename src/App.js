import './styles.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EAVULATE: 'evaluate'
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return { ...state, currentOperand: payload.digit, overwrite: false };
      }
      if (payload.digit === '0' && state.currentOperand === '0')
        return { state };
      if (payload.digit === '.' && state.currentOperand.includes('.'))
        return { state };
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        };
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        };
      }
      return {
        ...state,
        operation: payload.operation,
        currentOperand: null,
        previousOperand: evaluate(state)
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EAVULATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      )
        return {};
      return {
        overwrite: true,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state)
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return { overwrite: false, currentOperand: null };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return { ...state, currentOperand: state.currentOperand.slice(0 - 1) };

    default:
      return { ...state };
  }
}

function evaluate({ previousOperand, currentOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';
  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '/':
      computation = prev / current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    default:
      computation = '';
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="/">
        /
      </OperationButton>
      <DigitButton dispatch={dispatch} digit="1">
        1
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="2">
        2
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="3">
        3
      </DigitButton>
      <OperationButton dispatch={dispatch} operation="*">
        *
      </OperationButton>
      <DigitButton dispatch={dispatch} digit="4">
        4
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="5">
        5
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="6">
        6
      </DigitButton>
      <OperationButton dispatch={dispatch} operation="+">
        +
      </OperationButton>
      <DigitButton dispatch={dispatch} digit="7">
        7
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="8">
        8
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="9">
        9
      </DigitButton>
      <OperationButton dispatch={dispatch} operation="-">
        -
      </OperationButton>
      <DigitButton dispatch={dispatch} digit=".">
        .
      </DigitButton>
      <DigitButton dispatch={dispatch} digit="0">
        0
      </DigitButton>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EAVULATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
