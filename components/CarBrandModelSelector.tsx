import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import LoadingIndicator from './Loading';
import { BrandModel } from '../types/brands';

export default function CarBrandPicker({
    setBrand,
    setModel,
}: {
    setBrand: (brand: BrandModel | null) => void;
    setModel: (model: BrandModel | null) => void;
}) {
    const [brands, setBrands] = useState<BrandModel[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<BrandModel | null>(null);
    const [models, setModels] = useState<BrandModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<BrandModel | null>(null);
    const [brandSearch, setBrandSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isSelectingBrand, setIsSelectingBrand] = useState(true);

    // Fetch car brands
    useEffect(() => {
        async function fetchBrands() {
            try {
                setLoading(true);
                const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching car brands:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBrands();
    }, []);

    // Fetch car models when a brand is selected
    useEffect(() => {
        if (selectedBrand) {
            setLoading(true);
            const codigo = selectedBrand.codigo;
            async function fetchModels() {
                try {
                    const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigo}/modelos`);
                    setModels(response.data.modelos);
                } catch (error) {
                    console.error('Error fetching car models:', error);
                } finally {
                    setLoading(false);
                }
            }
            fetchModels();
        }
    }, [selectedBrand]);

    if (loading) return <LoadingIndicator />;

    const filteredBrands = brands.filter(brand =>
        brand.nome.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const filteredModels = models.filter(model =>
        model.nome.toLowerCase().includes(modelSearch.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Selecione a marca do veículo:</Text>
            <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                    setModalVisible(true);
                    setIsSelectingBrand(true);
                }}
            >
                <Text style={styles.selectedText}>
                    {selectedBrand ? selectedBrand.nome : 'Selecione uma marca'}
                </Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {isSelectingBrand ? (
                                <>
                                    <View style={styles.searchContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Pesquise a marca..."
                                            placeholderTextColor="#888"
                                            value={brandSearch}
                                            onChangeText={setBrandSearch}
                                        />
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => {
                                                setBrandSearch('');
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text style={styles.closeButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {filteredBrands.map((brand) => (
                                        <TouchableOpacity
                                            key={brand.codigo}
                                            style={styles.option}
                                            onPress={() => {
                                                setSelectedBrand(brand);
                                                setBrand(brand);
                                                setSelectedModel(null);
                                                setModel(null);
                                                setBrandSearch('');
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text style={styles.optionText}>{brand.nome}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <View style={styles.searchContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Pesquise o modelo..."
                                            placeholderTextColor="#888"
                                            value={modelSearch}
                                            onChangeText={setModelSearch}
                                        />
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => {
                                                setModelSearch('');
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text style={styles.closeButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {filteredModels.map((model) => (
                                        <TouchableOpacity
                                            key={model.codigo}
                                            style={styles.option}
                                            onPress={() => {
                                                setSelectedModel(model);
                                                setModel(model);
                                                setModelSearch('');
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text style={styles.optionText}>{model.nome}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {selectedBrand && (
                <>
                    <Text style={styles.label}>Selecione o modelo do veículo:</Text>
                    <TouchableOpacity
                        style={styles.selectInput}
                        onPress={() => {
                            setModalVisible(true);
                            setIsSelectingBrand(false);
                        }}
                    >
                        <Text style={styles.selectedText}>
                            {selectedModel ? selectedModel.nome : 'Selecione um modelo'}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    label: {
        color: '#fff',
        marginBottom: 10,
    },

    // input: {
    //     borderWidth: 1,
    //     borderColor: '#44EAC3',
    //     padding: 10,
    //     marginBottom: 20,
    //     color: '#fff',
    // },
    selectInput: {
        color: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#44EAC3',
        marginBottom: 20,
        justifyContent: 'center',
    },
    selectedText: {
        color: '#fff',
    },
    input: {
        backgroundColor: '#444',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    closeButton: {
        backgroundColor: '#e63946',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        width: '30%', // Define a largura do botão de fechar
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Para espaço entre input e botão
        alignItems: 'center',
        marginBottom: 10,
    },
    option: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 5,
    },
    optionText: {
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%', // Limitar a altura do modal
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        overflow: 'hidden', // Garantir que nada extrapole a borda do modal
    },
});
