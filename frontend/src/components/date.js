import { formatDate } from '../components/formatDate';

export default function Info() {
    const today = new Date();

    return <p>Consulta<br/>{formatDate(today)}</p>;
}
