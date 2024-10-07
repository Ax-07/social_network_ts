import { useEffect, useState, useCallback, type FunctionComponent } from 'react';
import { FormOrigin } from '../utils/switchOrigin';
import DatePicker from '../../Base/datePicker/DatePicker';
import { useForm } from '../hooks/useForm';

interface EventsFormProps {
    origin: FormOrigin;
}

const EventsForm: FunctionComponent<EventsFormProps> = ({ origin }) => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: ''
    });

    const { form, setFormState } = useForm(origin);

    // Regroupe les mises à jour du formulaire en un seul useEffect
    useEffect(() => {
        if (form.isEvent) {
            setFormState({
                startDate,
                ...formData,
            });
        }
    }, [startDate, formData, form.isEvent]);

    // Mémorise handleInputChange pour éviter la recréation de la fonction à chaque rendu
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    return (
        <form>
            <div>
                <label htmlFor="title" className="sr-only">Titre de l'évènement</label>
                <input
                    type="text"
                    id="title"
                    className="addpost__input"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Titre de l'événement"
                />
            </div>
            
            <div>
                <label htmlFor="description" className="sr-only">Description</label>
                <input
                    type="text"
                    id="description"
                    className="addpost__input"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                />
            </div>
            
            <div>
                <label htmlFor="location" className="sr-only">Lieu de l'événement</label>
                <input
                    type="text"
                    id="location"
                    className="addpost__input"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Lieu de l'événement"
                />
            </div>
            
            <div>
                <label className="sr-only">Date de début</label>
                <DatePicker selected={startDate} onChange={setStartDate} />
            </div>
        </form>
    );
};

export default EventsForm;
