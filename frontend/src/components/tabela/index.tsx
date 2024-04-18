import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContractsStart, fetchContractsSuccess, fetchContractsFailure } from '../../store/contractsSlice';
import { RootState, AppDispatch } from '../../store/index';
import { Contract } from '../../types';
import { formatCurrency } from '../../utils/moeda/index';
import { validateCpfCnpj } from '../../utils/cpfCnpj/index';
import { checkConsistency } from '../../utils/calculo/index';
import { fetchData } from '../../utils/api';

const Table = () => {
    const dispatch: AppDispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [allContracts, setAllContracts] = useState<Contract[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    const contracts = useSelector((state: RootState) => state.contracts.data);
    const loading = useSelector((state: RootState) => state.contracts.loading);
    const error = useSelector((state: RootState) => state.contracts.error);

    useEffect(() => {
        fetchData(dispatch, currentPage, pageSize, setAllContracts); 
    }, [currentPage, pageSize]);


    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const filteredContracts = allContracts.filter(contract => {
        const searchData = Object.values(contract).join('').toLowerCase();
        return searchData.includes(searchTerm.toLowerCase());
    });

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        const sortedContracts = [...allContracts];
        sortedContracts.sort((a, b) => {
            if (sortOrder === 'asc') {
                return b.vlTotal - a.vlTotal;
            } else {
                return a.vlTotal - b.vlTotal;
            }
        });
        setAllContracts(sortedContracts);
    };

    return (
        <div>
            <h2>Pesquise por página</h2>
            <input type="text" value={searchTerm} onChange={handleSearch} />
            {loading && <div>Carregando...</div>}
            {error && <div>Ocorreu um erro: {error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>ID <button onClick={toggleSortOrder}>{sortOrder === 'asc' ? '↓' : '↑'}</button></th>
                        <th>Número da Instituição</th>
                        <th>Número da Agência</th>
                        <th>Código do Cliente</th>
                        <th>Nome do Cliente</th>
                        <th>CPF/CNPJ</th>
                        <th>Número do Contrato</th>
                        <th>Data do Contrato</th>
                        <th>Quantidade de Prestações</th>
                        <th>Valor Total</th>
                        <th>Código do Produto</th>
                        <th>Descrição do Produto</th>
                        <th>Código da Carteira</th>
                        <th>Descrição da Carteira</th>
                        <th>Número da Proposta</th>
                        <th>Número da Prestação</th>
                        <th>Tipo de Prestação</th>
                        <th>Número da Sequência da Prestação</th>
                        <th>Data de Vencimento da Prestação</th>
                        <th>Valor da Prestação</th>
                        <th>Valor de Mora</th>
                        <th>Valor de Multa</th>
                        <th>Valor de Outros Acréscimos</th>
                        <th>Valor do IOF</th>
                        <th>Valor de Desconto</th>
                        <th>Valor Atual</th>
                        <th>ID Situação</th>
                        <th>ID Situação Venda</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContracts.map(contract => {
                        checkConsistency(contract); 
                        return (
                            <tr key={contract.id}>
                                <td>{contract.id}</td>
                                <td>{contract.nrInst}</td>
                                <td>{contract.nrAgencia}</td>
                                <td>{contract.cdClient}</td>  
                                <td>{contract.nmClient}</td>
                                <td>{validateCpfCnpj(contract.nrCpfCnpj)}</td>
                                <td>{contract.nrContrat}</td>
                                <td>{contract.dtContrato && contract.dtContrato.slice(0, 10)}</td>
                                <td>{contract.qtPrestacoes}</td> 
                                <td>{formatCurrency(contract.vlTotal)}</td>
                                <td>{contract.cdProduto}</td> 
                                <td>{contract.dsProduto}</td>
                                <td>{contract.cdCarteira}</td>
                                <td>{contract.dsCarteira}</td>
                                <td>{contract.nrProposta}</td>
                                <td>{contract.nrPresta}</td>
                                <td>{contract.tpPresta}</td>
                                <td>{contract.nrSeqPre}</td>
                                <td>{contract.dtVctPre && contract.dtVctPre.slice(0, 10)}</td>
                                <td>{formatCurrency(contract.vlPresta)}</td>
                                <td>{formatCurrency(contract.vlMora)}</td>
                                <td>{formatCurrency(contract.vlMulta)}</td>
                                <td>{formatCurrency(contract.vlOutAcr)}</td>
                                <td>{formatCurrency(contract.vlIof)}</td>
                                <td>{formatCurrency(contract.vlDescon)}</td>
                                <td>{formatCurrency(contract.vlAtual)}</td>
                                <td>{contract.idSituac}</td>
                                <td>{contract.idSitVen}</td> 
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior</button>
            <button onClick={goToNextPage}>Próxima</button>
        </div>
    );
};

export default Table;