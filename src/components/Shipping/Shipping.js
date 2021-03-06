import { useState, useContext, useEffect } from 'react';
import UserContext from '../../contexts/UserContexts.js';
import NewSubscriptionContext from '../../contexts/NewSubscriptionContext.js';
import { useHistory } from 'react-router-dom';
import { subscribe } from '../../services/gratibox.js';
import { PlanBox, ImgBox, SubscribeButton } from '../../styles/ViewPlanStyles.js';
import States from './States.js';
import styled from 'styled-components';

export default function Shipping() {
    const { user, setUser } = useContext(UserContext);
    const { newSubscription, setNewSubscription } = useContext(NewSubscriptionContext);
    const [name, setName] = useState('');
    const [adress, setAdress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (!user) {
            alert('Você não está logado!');
            return history.push('/home');
        }

        if (!newSubscription) return history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function zipcodeTyping (event) {
        const newValue = event.target.value;

        if ((typeof(Number(newValue[newValue.length - 1])) === "number" && newValue[newValue.length - 1] !== " " && !isNaN(Number(newValue[newValue.length - 1]))) || newValue === "") {
            setZipcode(newValue);
        } else {
            setZipcode(zipcode);
        }
    }

    async function submitShipping(event) {
        event.preventDefault();

        if (!state) return alert('Selecione o estado!');
        setLoading(true);

        const shippingAdress = {
            name,
            adress,
            zipcode,
            city,
            state,
        };

        const body = {
            ...newSubscription,
            shippingAdress,
        }

        try {
            await subscribe(user.token, body);
            setNewSubscription();
            alert('Plano assinado!');
            return history.push('/');
        } catch (error) {
            const status = error.response?.status;
            setLoading(false);

            if (status === 400) return alert('Dados inválidos!');
            if (status === 401) {
                alert('Sessão inválida! Faça o login novamente.');
                localStorage.removeItem('user');
                setUser();
                return history.push('/login');
            }
            return alert('Ocorreu algum erro!');
        }
    }

    return (
        <Container>
            <WelcomeUser>Bom te ver por aqui, {user.name.split(' ')[0]}.</WelcomeUser>
            <Quote>
                “Agradecer é arte de atrair coisas boas”
            </Quote>
            <form onSubmit={submitShipping}>
                <Box>
                    <NewImgBox>
                        <img src='https://github.com/driven-exercises/Projeto-GratiBox/blob/main/image03.jpg?raw=true' alt='Plano' />
                    </NewImgBox>
                    <Input
                        type='text'
                        placeholder='Nome completo'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={loading}
                        required
                    />
                    <Input
                        type='text'
                        placeholder='Endereço de entrega'
                        value={adress}
                        onChange={(event) => setAdress(event.target.value)}
                        disabled={loading}
                        required
                    />
                    <Input
                        type='text'
                        placeholder='CEP'
                        maxLength='8'
                        value={zipcode}
                        onChange={(event) => zipcodeTyping(event)}
                        disabled={loading}
                        required
                    />
                    <LastRow>
                        <CityInput
                            type='text'
                            placeholder='Cidade'
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            disabled={loading}
                            required
                        />
                        <States setState={setState} loading={loading} />
                    </LastRow>
                </Box>
                <SubmitButton disabled={loading}>
                    Finalizar
                </SubmitButton>
            </form>
        </Container>
    );
}

const Container = styled.div`
    width: 95%;
    max-width: 500px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
`;

const WelcomeUser = styled.h1`
    font-size: 26px;
    font-weight: 700;
    text-align: left;
    margin: 20% 0 22px;
`;

const Quote = styled.p`
    font-size: 18px;
    font-weight: 300;
    line-height: 21px;
    margin-bottom: 20px;
    text-align: left;
`

const Box = styled(PlanBox)`
    height: 450px;
    max-height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    margin-bottom: 0;
`;

const NewImgBox = styled(ImgBox)`
    height: 40%;
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 90%;
    min-height: 10%;
    background-color: rgba(224, 209, 237, 0.62);
    border-radius: 5px;
    border: none;
    font-size: 18px;
    color: #4d65a8;
    display: block;
    margin: 0 auto 7px;
    padding-left: 12px;
    filter: ${({ disabled }) => disabled ? 'brightness(0.9)' : 'none'};

    ::placeholder {
        font-weight: 700;
        color: #4d65a8;
    }
`;

const LastRow = styled.div`
    width: 90%;
    height: 45px;
    display: flex;
    margin: 0 auto;
`;

const CityInput = styled(Input)`
    width: 60%;
    height: 100%;
    margin: 0 13px 0 0;
`;

const SubmitButton = styled(SubscribeButton)`
    width: 200px;
    height: 40px;
    margin: 7px auto 7px;
    filter: ${({ disabled }) => disabled ? 'brightness(0.8)' : 'none'};
`;
