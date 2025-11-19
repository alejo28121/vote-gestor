import { useEffect, useState } from "react";
import { formatDate } from '../components/formatDate';

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <p>
            {formatDate(time)}<br/>{time.toLocaleTimeString("es-ES")}
        </p>
    );
}
