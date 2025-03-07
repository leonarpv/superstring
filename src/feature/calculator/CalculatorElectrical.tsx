import React from 'react';
import {
    Form,
    Button,
    Row,
    Col,
    InputGroup
}
from 'react-bootstrap';
import MathJax from 'react-mathjax';
import Wrapper from '../../component/Wrapper';
import * as Calculator from '../../api/calculator';
import './CalculatorElectrical.css';

const MAXIMUM_RESISTANCE = 1000000.0;
const MAXIMUM_CURRENT = 1000000.0;
const MAXIMUM_VOLTAGE = 1000000.0;
const MAXIMUM_POWER = 1000000.0;
const CALCULATE_FAIL_MESSAGE = 'Unable to calculate missing values';

const CalculatorElectrical: React.FC = () => {
    const [resistance, setResistance] = React.useState(0.0);
    const [current, setCurrent] = React.useState(0.0);
    const [voltage, setVoltage] = React.useState(0.0);
    const [power, setPower] = React.useState(0.0);
    const [useable, setUseable] = React.useState([false, false, false, false]);

    const calculate = () => {
        if (resistance !== 0.0 && voltage !== 0.0) {
            const i = Calculator.calculateCurrent(undefined, voltage, resistance);
            const p = Calculator.calculatePower(undefined, voltage, resistance);

            if (i && p) {
                setCurrent(i);
                setPower(p);
            }
            else throw Error(CALCULATE_FAIL_MESSAGE);
        }
        else if (resistance !== 0.0 && current !== 0.0) {
            const v = Calculator.calculateVoltage(undefined, current, resistance);
            const p = Calculator.calculatePower(current, undefined, resistance);

            if (v && p) {
                setVoltage(v);
                setPower(p);
            }
            else throw Error(CALCULATE_FAIL_MESSAGE);
        }
        else if (resistance !== 0.0 && power !== 0.0) {
            const v = Calculator.calculateVoltage(power, undefined, resistance);
            const i = Calculator.calculateCurrent(power, undefined, resistance);

            if (v && i) {
                setVoltage(v);
                setCurrent(i);
            }
            else throw Error(CALCULATE_FAIL_MESSAGE);
        }
        else if (current !== 0.0 && voltage !== 0.0) {
            const r = Calculator.calculateResistance(undefined, voltage, current);
            const p = Calculator.calculatePower(current, voltage, undefined);

            if (r && p) {
                setResistance(r);
                setPower(p);
            }
            else throw Error(CALCULATE_FAIL_MESSAGE);
        }
        else if (current !== 0.0 && power !== 0.0) {
            const v = Calculator.calculateVoltage(power, current, undefined);
            const r = Calculator.calculateResistance(power, undefined, current);

            if (v && r) {
                setVoltage(v);
                setResistance(r);
            }
            else throw Error(CALCULATE_FAIL_MESSAGE);
        }
        else if (voltage !== 0.0 && power !== 0.0) {
            const i = Calculator.calculateCurrent(power, voltage, undefined);
            const r = Calculator.calculateResistance(power, voltage, undefined);

            if (i && r) {
                setCurrent(i);
                setResistance(r);
            }
            else throw Error(CALCULATE_FAIL_MESSAGE);
        }
    };

    const update = (index: number, active: boolean) => {
        const copy = [...useable];
        copy[index] = active;
        setUseable(copy);
    };

    const reset = () => {
        setResistance(0.0);
        setCurrent(0.0);
        setVoltage(0.0);
        setPower(0.0);
        setUseable([false, false, false, false]);
    };

    const isDisabled = () => {
        let count = 0;

        if (useable[0]) count++;
        if (useable[1]) count++;
        if (useable[2]) count++;
        if (useable[3]) count++;

        return count < 2;
    };

    return (
        <Wrapper>
            <Row className="py-5 mx-0">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="unit-symbol">
                                <em>Ω</em>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id="resistance"
                            type="number"
                            min={0.0}
                            max={MAXIMUM_RESISTANCE}
                            step="any"
                            value={resistance}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setResistance(value);
                                update(0, value > 0.0);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="unit-symbol">
                                <em>A</em>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id="current"
                            type="number"
                            min={0.0}
                            max={MAXIMUM_CURRENT}
                            step="any"
                            value={current}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setCurrent(value);
                                update(1, value > 0.0);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="unit-symbol">
                                <em>V</em>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id="voltage"
                            type="number"
                            min={0.0}
                            max={MAXIMUM_VOLTAGE}
                            step="any"
                            value={voltage}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setVoltage(value);
                                update(2, value > 0.0);
                            }}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text className="unit-symbol">
                                <em>W</em>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            id="power"
                            type="number"
                            min={0.0}
                            max={MAXIMUM_POWER}
                            step="any"
                            value={power}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                setPower(value);
                                update(3, value > 0.0);
                            }}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row className="pb-5 mx-0 justify-content-center align-items-center">
                <Col md />
                <Col>
                    <Button className="w-100" disabled={isDisabled()} onClick={calculate}>Calculate</Button>
                </Col>
                <Col>
                    <Button className="w-100" variant="secondary" onClick={reset}>Reset</Button>
                </Col>
                <Col md />
            </Row>
            <Row className="pb-5 mx-0">
                <Col xs={6} md={3}>
                    <MathJax.Provider>
                        <h1 className="p-1 border-bottom text-center">Ohms</h1>
                        <br />
                        <div className="p-1">
                            <MathJax.Node formula={'R = \\frac{V}{I}'} />
                            <br />
                            <MathJax.Node formula={'R = \\frac{V^2}{P}'} />
                            <br />
                            <MathJax.Node formula={'R = \\frac{P}{I^2}'} />
                        </div>
                    </MathJax.Provider>
                </Col>
                <Col xs={6} md={3}>
                    <MathJax.Provider>
                        <h1 className="p-1 border-bottom text-center">Amps</h1>
                        <br />
                        <div className="p-1">
                            <MathJax.Node formula={'I = \\frac{V}{R}'} />
                            <br />
                            <MathJax.Node formula={'I = \\frac{P}{V}'} />
                            <br />
                            <MathJax.Node formula={'I = \\sqrt{\\frac{P}{R}}'} />
                        </div>
                    </MathJax.Provider>
                </Col>
                <Col xs={6} md={3}>
                    <MathJax.Provider>
                        <h1 className="p-1 border-bottom text-center">Volts</h1>
                        <br />
                        <div className="p-1">
                            <MathJax.Node formula={'V = I\\cdot{R}'} />
                            <br />
                            <MathJax.Node formula={'V = \\frac{P}{I}'} />
                            <br />
                            <MathJax.Node formula={'V = \\sqrt{P\\cdot{R}}'} />
                        </div>
                    </MathJax.Provider>
                </Col>
                <Col xs={6} md={3}>
                    <MathJax.Provider>
                        <h1 className="p-1 border-bottom text-center">Watts</h1>
                        <br />
                        <div className="p-1">
                            <MathJax.Node formula={'P = V\\cdot{I}'} />
                            <br />
                            <MathJax.Node formula={'P = \\frac{V^2}{R}'} />
                            <br />
                            <MathJax.Node formula={'P = I^2\\cdot{R}'} />
                        </div>
                    </MathJax.Provider>
                </Col>
            </Row>
        </Wrapper>
    );
};

export default CalculatorElectrical;
