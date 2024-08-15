import { Vaccine } from '@/types';

import { FaSyringe } from 'react-icons/fa6';
import { getVaccine } from '../_lib/data-service';

interface VaccineInformationProps {
  vaccineId: string;
}

const VaccineInformation: React.FC<VaccineInformationProps> = async function ({
  vaccineId,
}) {
  const vaccine: Vaccine = await getVaccine(vaccineId);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary-50 inline-flex rounded-lg p-6">
          <FaSyringe size={32} />
        </div>
        <div>
          <p className="text-lg">
            <span className="text-primary-800">Vaccine:</span> {vaccine.name}
          </p>
          <p className="text-lg">
            <span className="text-primary-800">Protects against: </span>
            {vaccine.protects_against}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-primary-800">Importance</h2>
        <p className="text-lg">{vaccine.importance}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-primary-800">
          Side Effects
        </h2>
        <p className="text-lg">{vaccine.side_effects}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-primary-800">
          Age of Administration
        </h2>
        <p className="text-lg">{vaccine.administration_age}</p>
      </div>
    </div>
  );
};

export default VaccineInformation;
