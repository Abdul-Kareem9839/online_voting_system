import { motion } from "framer-motion";
import WelcomeCard from "./components/WelcomeCard";
import ElectionStats from "./components/ElectionStats";
import Stats from "./components/Stats";
import QuickAction from "./components/QuickActions";

const OverviewTab = ({ data, onTabChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <WelcomeCard data={data} />

      {/* Stats */}
      <Stats data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Elections Stats */}
        <ElectionStats data={data} />

        {/* Quick Actions */}
        <QuickAction onTabChange={onTabChange} />
      </div>
    </motion.div>
  );
};

export default OverviewTab;
