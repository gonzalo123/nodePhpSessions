<?php
class NodeSession
{
    const NODE_DEF_HOST = '127.0.0.1';
    const NODE_DEF_PORT = 5672;

    static function start($host = self::NODE_DEF_HOST, $port = self::NODE_DEF_PORT)
    {
        $obj = new self($host, $port);
        session_set_save_handler(
            array($obj, "open"),
            array($obj, "close"),
            array($obj, "read"),
            array($obj, "write"),
            array($obj, "destroy"),
            array($obj, "gc"));
        session_start();
        return $obj;
    }

    private function unserializeSession($data)
    {
        if(  strlen( $data) == 0) {
            return array();
        }

        // match all the session keys and offsets
        preg_match_all('/(^|;|\})([a-zA-Z0-9_]+)\|/i', $data, $matchesarray, PREG_OFFSET_CAPTURE);
        $returnArray = array();

        $lastOffset = null;
        $currentKey = '';
        foreach ( $matchesarray[2] as $value ) {
            $offset = $value[1];
            if(!is_null( $lastOffset)) {
                $valueText = substr($data, $lastOffset, $offset - $lastOffset );
                $returnArray[$currentKey] = unserialize($valueText);
            }
            $currentKey = $value[0];

            $lastOffset = $offset + strlen( $currentKey )+1;
        }

        $valueText = substr($data, $lastOffset );
        $returnArray[$currentKey] = unserialize($valueText);

        return $returnArray;
    }
    
    function __construct($host = self::NODE_DEF_HOST, $port = self::NODE_DEF_PORT)
    {
        $this->_host = $host;
        $this->_port = $port;
    }

    function open($save_path, $session_name)
    {
        return true;
    }

    function close()
    {
        return true;
    }

    public function read($id)
    {
        return (string) $this->send(__FUNCTION__, array('id' => $id));
    }

    public function write($id, $data)
    {
        try {
            $this->send(__FUNCTION__, array(
                'id'       => $id,
                'data'     => $data,
                'time'     => time(),
                'dataJSON' => json_encode($this->unserializeSession($data))));
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function destroy($id)
    {
        try {
            $this->send(__FUNCTION__, array('id' => $id));
        } catch (Exception $e) {
            return false;
        }
         return true;
    }

    function gc($maxlifetime)
    {
        try {
            $this->send(__FUNCTION__, array('maxlifetime' => $maxlifetime, 'time' => time()));
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    private function send($action, $params)
    {
        $params = array('action' => $action) + $params;
        return file_get_contents("http://{$this->_host}:{$this->_port}?" . http_build_query($params));
    }
}
