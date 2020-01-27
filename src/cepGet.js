import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import {Alert, Button, InputGroup, FormControl, Table, Jumbotron} from 'react-bootstrap';

function EntradaDeCEP(props) {
    return (
        <>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>CEP a consultar:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={props.onInput.bind(this)} />
                <InputGroup.Append>
                    <Button variant='outline-primary' onClick={props.onSubmit}>OK</Button>
                </InputGroup.Append>
            </InputGroup>
        </>
    );
}

function MostradorDeCEP(props) {
    return (
        <Table bordered responsive sm>
            <thead>
            <tr >
                <th>CEP</th>
                <th>Logradouro</th>
                <th>Complemento</th>
                <th>Bairro</th>
                <th>Localidade</th>
                <th>UF</th>
            </tr>
            </thead>
            <tbody>
            {
                props.ceps.map(cep => (
                        <tr>
                            <td>{cep.cep}</td>
                            <td>{cep.logradouro}</td>
                            <td>{cep.complemento}</td>
                            <td>{cep.bairro}</td>
                            <td>{cep.localidade}</td>
                            <td>{cep.uf}</td>
                        </tr>
                ))
            }
            </tbody>
        </Table>
    );
}

class ConsultaCEP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cepAConsultar: '',
            ultimFalho: false,
            cepsJaConsultados: [],
        }
    }
    
    analisarCEP() {
        const cep = this.state.cepAConsultar;
        let dadosDoCEP;
        
        axios(`http://viacep.com.br/ws/${cep}/json/`)
        .then(
            response => {
                const ultimosCEPS = this.state.cepsJaConsultados;
                this.setState({
                    ultimFalho: false,
                    cepsJaConsultados: ultimosCEPS.concat([response.data]),
                    cepAConsultar: '',
                });
            }
        ).catch(
            (error) => this.setState({ultimFalho: true})
        );
    }
    
    render() {
        return (
            <>
            <Jumbotron>
                <h1>Consultador de CEP</h1>
                {
                    this.state.ultimFalho ? (<Alert variant="danger">
                        Falha ao obter informações. Confirme se o CEP está digitado corretamente.
                    </Alert>) : null
                }
                <EntradaDeCEP onInput={e => this.setState({cepAConsultar: e.target.value})} onSubmit={() => this.analisarCEP()} ></EntradaDeCEP>
            </Jumbotron>
                <MostradorDeCEP ceps={this.state.cepsJaConsultados} ></MostradorDeCEP>
            </>
        );
    }
}

export default ConsultaCEP;
